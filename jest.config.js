module.exports = {
  projects: [
    '<rootDir>/workshop/12-testUseMutation/jest.config.js',
  ],
  transform: {
    '^.+\\.(js|ts|tsx)?$': require('path').resolve('./customBabelTransformer'),
  },
  moduleFileExtensions: ['js', 'css', 'ts', 'tsx'],
  moduleNameMapper: {
    '^@workshop/graphql$': '<rootDir>/packages/graphql/src/index.ts',
  },
};
