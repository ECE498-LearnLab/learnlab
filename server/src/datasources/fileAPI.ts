import Knex from "knex";
import {
    File,
    Maybe,
    MutationCreateTagArgs,
    MutationUploadFileArgs, QueryFilesForClassroomArgs,
    QueryFileTagsForClassroomArgs,
    Response, Tag
} from "../generated/graphql";
import { s3Uploader } from "../index";

/**
 * File API.
 * 
 * Use this API to upload and retrive files for a classroom.
 */
export default (db: Knex) => {

    return {
        getFilesByClassroom: async ({ class_id }: QueryFilesForClassroomArgs): Promise<Maybe<Array<Maybe<File>>>> => {
            return await db.from('files')
            .leftJoin('files_tags', {'files.id': 'files_tags.file_id'})
            .leftJoin('tags', {'files_tags.tag_id': 'tags.id'})
            .select(['files.id as id', 
            'files.filename as filename', 
            'files.class_id as class_id',
            'files.created_at as created_at', 
            'files.storage_link as storage_link', 
            db.raw(`coalesce(array_agg(
                json_build_object('id', tags.id, 'color', tags.color, 'tag', tags.tag, 'class_id', tags.class_id)
                ) filter (where tags.id is not null), '{}') as tags`)
            ])
            .where({ 'files.class_id': class_id })
            .groupBy('files.id', 'files.filename');
        },
        getFileTagsByClassroom: async ({ class_id }: QueryFileTagsForClassroomArgs): Promise<Maybe<Array<Maybe<Tag>>>> => {
            return await db.select('*').from('tags')
            .where({ class_id });
        },
        uploadFile: async (fileInfo: MutationUploadFileArgs)
        : Promise<Maybe<Response>> => {
            const { class_id, file, tags } = fileInfo;
            let success = true, message;
            
            const { filename, url} = await s3Uploader.singleFileUploadResolver.bind(s3Uploader)(file);

            const res = await db('files').returning('id').insert({
                class_id,
                filename,
                storage_link: url,
            }).catch((err) => {
                success = false;
                message = err.message;
            });

            if (!success) {
                return { success, message };
            }
            
            if (tags) {
                await db('files_tags').insert(tags.map((id) => ({file_id: res[0], tag_id: id})));
            }
            
            return {
                success,
                message: `File ${filename} was successfully uploaded`
            };
        },
        createTag: async (tagInfo: MutationCreateTagArgs)
        : Promise<Maybe<Response>> => {
            const { class_id, tag, color} = tagInfo;
            let success = true, message;

            await db('tags').returning('id').insert({
                class_id,
                tag,
                color,
            }).catch((err) => {
                success = false;
                message = err.message;
            });

            if (!success) {
                return { success, message };
            }

            return {
                success,
                message: `Tag "${tag}" was successfully uploaded`
            };
        },
    };
};