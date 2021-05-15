var { buildSchema } = require('graphql');
 
// Construct a schema, using GraphQL schema language
module.exports = buildSchema(`
    type Query {
      getNotes(statusFilter: String!): String!,
      getNote(id: String!): String!,
      addNote: String!,
      updateNote(id: String!, title: String!, status: String!, completionDate: String!, text: String!): String!
      deleteNote(id: String!): String!,
    }
  `);
