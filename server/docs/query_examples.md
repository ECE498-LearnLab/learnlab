# GraphQL Query Example Usages

----
- [GraphQL Query Example Usages](#graphql-query-example-usages)
  - [- Mutation Usage Examples](#--mutation-usage-examples)
  - [Query Usage Examples](#query-usage-examples)
    - [Sample Execution](#sample-execution)
  - [Mutation Usage Examples](#mutation-usage-examples)
---


## Query Usage Examples
```GraphQL

query getQuestions($room_id: ID!) {
  questions(room_id: $room_id) {
    id
    text
    created_at
    deleted_at
  }
}

query getParticipants {
  participants(room_id: 1) {
    id
    first_name,
    last_name,
    role, 
    email
  }
}

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

query getUserByEmail($email: String!) {
  userByEmail(email: $email) {
    user {
      id
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
```json
{"id": 4}
```
**Result**:
```json
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

mutation createTeacher($first_name: String!, $last_name: String!, $email: String!, $created_at: Date, $prefix: TeacherPrefix) {
  createTeacher(first_name: $first_name, last_name: $last_name, email: $email, created_at: $created_at, prefix: $prefix) {
    user_id
    success
    message
  }
}

mutation createStudent($first_name: String!, $last_name: String!, $email: String!, $created_at: Date, $parent_email: String) {
  createStudent(first_name: $first_name, last_name: $last_name, email: $email, created_at: $created_at, parent_email: $parent_email) {
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

mutation invite {
  invite(student_ids: [1,2], room_id: 1) {
    success
    message
  }
}

mutation joinRoom {
  joinRoom(student_id: 2, room_id: 1) {
    success
    message
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

mutation submitQuestion {
  submitQuestion(student_id: 2, room_id: 1, text: "When is dinner?") {
    id
    created_at
    success
    message
  }
}

mutation upvoteQuestion {
  upvoteQuestion(id: 1) {
    upvotes
  }
}

mutation answerQuestion($id: ID!) {
  answerQuestion(id: $id) {
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

query getEngagementHistory($room_id: ID!, $student_id: ID!) {
  engagementHistory(room_id: $room_id, student_id: $student_id) {
      id,
      room_id,
      student_id,
      score,
      classification,
      created_at,
      updated_at
  }
}

mutation upsertEngagementStatCurrent($room_id: ID!, $student_id: ID!, $score: Int, $classification: String) {
  upsertEngagementCurrent(room_id: $room_id, student_id: $student_id, score: $score, classification: $classification) {
    success,
    message
  }
}
```