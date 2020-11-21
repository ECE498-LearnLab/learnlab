import Knex from "knex";
import {
    Classroom, ClassroomDetails, CreateClassroomResponse,
    MutationAddStudentsToClassroomArgs, MutationCreateClassroomArgs, QueryClassroomDetailsArgs,
    Response,
    Role
} from "../generated/graphql";

/**
 * Classroom API.
 * 
 * Use this API to create, retrieve, and get details about the instructor and students
 * of a classroom and more.
 */
export default (db: Knex) => {
    return {
        getClassroom: async (id: string): Promise<Classroom> => {
            const res = await db.select('*').from('classrooms').where({ id }) as Classroom[];
            return res[0];
        },
        getClassDetails: async ({id: class_id, role}: QueryClassroomDetailsArgs): Promise<ClassroomDetails> => {
            const teacherInfo = (await db.select('teacher_id as id', 'first_name', 'last_name', 'role', 'email')
                                        .from('teachers').join('teaches', {'teachers.id': 'teaches.teacher_id'})
                                        .join('users', {'users.id': 'teachers.id'})
                                        .where({class_id}))[0];
            
            const classInfo = (await db.select('*').from('classrooms').where({id: class_id}))[0];

            let studentFields = ['id', 'first_name', 'last_name', 'role', 'email'];
            if ([Role.Admin, Role.Instructor].includes(role)) {
                studentFields = studentFields.concat(['last_login', 'phone_number']);
            }

            const students = await db.select(studentFields)
                                     .from('takes')
                                     .join('users', {'users.id': 'takes.student_id'})
                                     .where({class_id});
    
            return {
                classroom: classInfo,
                instructor: teacherInfo,
                students
            };
        },
        createClassroom: async (classInfo: MutationCreateClassroomArgs): Promise<CreateClassroomResponse> => {
            const { name, subject, teacher_id, description } = classInfo;
            let success = true, message;
    
            const res = await db('classrooms').returning('id').insert({
                name, subject, description
            }).catch((err) => {
                success = false;
                message = err.message;
            });

            await db('teaches').insert({teacher_id, class_id: res[0]});
    
            if (!success) {
                return { success, message };
            }
    
            return {
                class_id: res[0],
                success,
                message: `Classroom "${name}" was successfully created`
            };
        },
        addStudentsToClassroom: async ({class_id, student_emails}: MutationAddStudentsToClassroomArgs)
        : Promise<Response> => {
            let success = true, message;

            await db.select('id').from('users').whereIn('email', student_emails)
                    // quietly ignore duplicate student additions to the classroom
                    .then((rows) => db.raw(`? ON CONFLICT (class_id, student_id) DO NOTHING RETURNING *;`,
                                    [db('takes').insert(rows.map(({id}) => ({student_id: id, class_id})))]))
                    .catch((err) => {
                        success = false;
                        message = err.message;
                    });

            if (!success) {
                return { success, message };
            }

            return {
                success,
                message: `Students successfully added to classroom ${class_id}`
            };
        }
    };
};