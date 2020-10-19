from django.db import models
import graphene
import json

class Engagement(graphene.ObjectType):
    result = graphene.String()

# We must define a query for our schema
class Query(graphene.ObjectType):
    # engagement = graphene.Field(Engagement)

    engagements = graphene.List(Engagement, first=graphene.Int())
    all_engagements = graphene.List(Engagement)


class AddEngagement(graphene.Mutation):

    class Arguments:
        result = graphene.String()

    engagement = graphene.Field(Engagement)

    def mutate(self, info, result):
        engagement = Engagement(result=result)
        return AddEngagement(engagement=engagement)



class Mutations(graphene.ObjectType):
    add_engagement = AddEngagement.Field()

schema = graphene.Schema(query=Query, mutation=Mutations)

result = schema.execute(
    '''
    mutation {
        addEngagement(result: "22%") {
            engagement {
                result
            }
        }
    }
    '''
)

print(result)
items = dict(result.data.items())
print(json.dumps(items))
