import { Field, ID, ObjectType } from 'type-graphql';
import { Book } from '../../books/models/book.model';
import { Academy } from '../../academies/models/academy.model';

@ObjectType()
export class DocumentMember {
  // запись могут дропнуть из системы
  @Field(type => Book, { nullable: true })
  book: Book;

  @Field(type => ID)
  bookId: number;

  @Field()
  bookCode: string;

  @Field()
  date: string;

  @Field()
  mark: string;

  academy: Academy;
}
