db.documents.insertMany([
  // MongoDB adds the _id field with an ObjectId if _id is not present
  {
    name: 'Sample Document', tags: ['docker', 'containers', 'javascript']
  },
  {
    name: 'Another sample document', tags: ['development', 'compose']
  },
  {
    name: 'Third sample document', tags: ['swarm', 'production', 'node.js']
  }
]);
