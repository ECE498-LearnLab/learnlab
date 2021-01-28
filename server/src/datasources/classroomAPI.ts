import Knex from "knex";
import {
    Classroom, ClassroomDetails, ClassroomsTaken, ClassroomsTaught, CreateClassroomResponse,
    MutationAddStudentsToClassroomArgs, MutationCreateClassroomArgs, QueryClassroomDetailsArgs,
    QueryClassroomsTakenArgs,
    QueryClassroomsTaughtArgs,
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
            if (Role.Instructor === role) {
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
        getClassroomsTaken: async ({student_id}: QueryClassroomsTakenArgs): Promise<ClassroomsTaken>  => {
            const classroomFields = ['id', 'name', 'subject', 'description', 'created_at', 'updated_at'];
            const classes = await db.select(classroomFields)
                                     .from('takes')
                                     .join('classrooms', {'classrooms.id': 'takes.class_id'})
                                     .where({student_id});
            return {
                classrooms: classes
            };
        },
        getClassroomsTaught: async ({teacher_id}: QueryClassroomsTaughtArgs): Promise<ClassroomsTaught> => {
            const classroomFields = ['id', 'name', 'subject', 'description', 'created_at', 'updated_at'];
            const classes = await db.select(classroomFields)
                                     .from('teaches')
                                     .join('classrooms', {'classrooms.id': 'teaches.class_id'})
                                     .where({teacher_id});
            return {
                classrooms: classes
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