import { Comment } from '@/users/entities/comment.entity';
import { setSeederFactory } from 'typeorm-extension';

export const CommentFactory = setSeederFactory(Comment, (faker) => {
  const comment = new Comment({
    content: faker.lorem.paragraph(),
  });
  return comment;
});
