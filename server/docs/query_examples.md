# GraphQL Query Example Usages

----
* [Query Usage Examples](##Query-Usage-Examples)
  * [Sample Execution](###Sample-Execution)
* [Mutation Usage Examples](##Mutation-Usage-Examples)
---


## Query Usage Examples
```GraphQL
query getUser($id: ID!) {
  user(id: $id) {
    user {
      first_name,
      last_name
      email
      created_at
    }
	success
    message
  }
}

query getRoomsForClassroom($class_id: ID!, $room_states: [RoomState]){
  roomsForClassroom(class_id: $class_id, room_states: $room_states){
    id
    room_uuid
    name
    start_time
    room_status
  }
}

query getClassroom($id: ID!) {
  classroom(id: $id) {
    id
    name
    subject
    created_at
  }
}

query getClassroomDetails($class_id: ID!, $role: Role!) {
  classroomDetails(id: $class_id, role: $role) {
    instructor {
      first_name
      last_name
    },
    classroom {
      name
      description
    },
    students {
      first_name
      email
    }
  }
}
```
### Sample Execution
**Query**:
```GraphQL
query getClassroom($id: ID!) {
  classroom(id: $id) {
    id
    name
    subject
    created_at
  }
}
```
**Query Variables**:
```GraphQL
{"id": 4}
```
**Result**:
```GraphQL
{
  "data": {
    "classroom": {
      "id": "4",
      "name": "ECE 409 Lesson 2",
      "subject": "Security",
      "created_at": 1605397011650
    }
  }
}
```

## Mutation Usage Examples
```GraphQL

mutation answerQuestion($id: ID!) {
  answerQuestion(id: $id) {
    success
    message
  }
}

mutation createTeacher($first_name: String!, $last_name: String!, $role: Role!, $email: String!, $created_at: Date) {
  createUser(first_name: $first_name, last_name: $last_name, role: $role, email: $email, created_at: $created_at) {
    user_id
    success
    message
  }
}

mutation createStudent($first_name: String!, $last_name: String!, $role: Role!, $email: String!, $created_at: Date, $parent_email: String) {
  createUser(first_name: $first_name, last_name: $last_name, role: $role, email: $email, created_at: $created_at, parent_email: $parent_email) {
    user_id
    success
    message
  }
}

mutation createRoom($class_id: ID!, $name: String!, $start_time: Date, $end_time: Date) {
  createRoom(class_id: $class_id, name: $name, start_time: $start_time, end_time: $end_time) {
    success
    message
    room_uuid
    id
  }
}

mutation updateRoomStatus($room_id: ID!, $room_status: RoomState!) {
  updateRoomStatus(room_id: $room_id, room_status: $room_status){
    success
    message
  }
}

mutation createClassroom($name: String!, $subject: String!, $teacher_id: ID!, $description: String) {
  createClassroom(name: $name, subject: $subject, teacher_id: $teacher_id, description: $description) {
    class_id
    success
    message
  }
}

mutation postQuestion($room_id: ID!, $student_id: ID!, $text: String!) {
  submitQuestion(room_id: $room_id, student_id: $student_id, text: $text) {
    success
    message
  }
}

mutation addStudentsToClass($class_id: ID!, $student_emails: [String!]){
  addStudentsToClassroom(class_id: $class_id, student_emails: $student_emails) {
    success
    message
  }
}
```