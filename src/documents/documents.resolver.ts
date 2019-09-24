import {
  Args,
  Parent,
  Query,
  ResolveProperty,
  Resolver,
} from '@nestjs/graphql';
import { Observable, of } from 'rxjs';
import { FetchDocumentArgs } from './dto/fetch-document.args';
import { Document } from './models/document.model';
import { DocumentsService } from './documents.service';
import { Division } from '../divisions/models/division.model';
import { DivisionsService } from '../divisions/divisions.service';
import { GroupsService } from '../groups/groups.service';
import { Group } from '../groups/models/group.model';
import { DocumentMember } from './models/document-member.model';
import { ResolveMemberPropertyArgs } from './dto/resolve-member-property.args';
import { SaveStoriesService } from './save-stories.service';
import { SaveStory } from './models/save-story.model';

// tslint:disable-next-line:no-shadowed-variable
@Resolver(of => Document)
export class DocumentsResolver {
  constructor(
    private readonly divisionsService: DivisionsService,
    private readonly groupsService: GroupsService,
    private readonly documentsService: DocumentsService,
    private readonly saveStoriesService: SaveStoriesService,
  ) {}

  @ResolveProperty()
  saveStories(@Parent() { id, academyId }: Document): Observable<SaveStory> {
    return this.saveStoriesService.fetchByDocumentId({
      academyId,
      documentId: id,
    });
  }

  @ResolveProperty()
  members(
    @Args() { bookId }: ResolveMemberPropertyArgs,
    @Parent() { members }: Document,
  ): Observable<DocumentMember[]> {
    if (!bookId) {
      return of(members);
    }
    return of(members.filter(member => member.bookId === Number(bookId)));
  }

  @ResolveProperty()
  division(@Parent() { divisionId, academyId }: Document): Observable<
    Division
  > {
    return this.divisionsService.fetchById({ academyId, divisionId });
  }

  @ResolveProperty()
  group(@Parent() { groupId, academyId }: Document): Observable<Group> {
    return this.groupsService.fetchById({ academyId, groupId });
  }

  @Query(returns => Document, { name: 'document' })
  fetchDocument(@Args() { academyId, documentId }: FetchDocumentArgs):
    | Observable<Document>
    | any {
    return this.documentsService.fetchById({ academyId, documentId });
  }
}