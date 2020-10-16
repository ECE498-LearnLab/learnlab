import graphene
from graphene_django import DjangoObjectType

from engagement_analysis.analysis.models import Result


class ResultType(DjangoObjectType):
    class Meta:
        model = Result
        fields = ("id", "name", "notes")


class Query(graphene.ObjectType):
    all_results = graphene.List(ResultType)

    def resolve_all_results(root, info):
        # We can easily optimize query count in the resolve method
        return Result.objects.all()


schema = graphene.Schema(query=Query)
