import { Comment } from './comment';

jest.mock('../../database/database', () => {
  return {
    Database: jest.fn().mockImplementation(() => {
      return {
        executeSQL: jest.fn().mockResolvedValue([{ id: 1, content: 'test comment', userId: 1 }])
      };
    })
  };
});

describe('Comment API', () => {
  let comment: Comment;

  beforeAll(() => {
    comment = new Comment();
  });

  it('should retrieve comments', async () => {
    const result = await comment.getComment();
    expect(result).toEqual(expect.any(Array)); // assuming getComment returns an array
    expect(result[0]).toHaveProperty('content', 'test comment');
  });
});

// Mithilfe von GPT3 habe ich die Tests geschrieben.
// Ich habe die Tests mit Jest geschrieben.