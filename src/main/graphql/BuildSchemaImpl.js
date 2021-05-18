var { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
module.exports = buildSchema(`
    type Note {
      id: String!,
      title: String!,
      status: String!,
      completionDate: String!,
      text: String!,
      files: [String!]
    }
    type Query {
      getNotes(statusFilter: String!, completionDateOrder: String!): [Note],
      getNote(id: String!): Note
    }
    type Mutation {
      addNote: Note,
      updateNote(id: String!, title: String!, status: String!, completionDate: String!, text: String!, files: [String!]): Boolean
      deleteNote(id: String!): Boolean,
    }
  `);
