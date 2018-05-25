import json
from django.shortcuts import render
from flagChecker.models import Flag
from flagChecker.serializers import FlagSerializer
from django.http import JsonResponse
from rest_framework import generics
from django.views.decorators.csrf import csrf_exempt

class FlagCreate(generics.ListCreateAPIView):
  queryset = Flag.objects.all()
  serializer_class = FlagSerializer



def getFlag(challengeSolution):
  flags = [
    {
      "challenge": "web100",
      "challengeSolution": "helloworld",
      "flag": "csg{wediditbaby}"
    },
    {
      "challenge": "crypto300",
      "challengeSolution": "yoyoyoyo",
      "flag": "csg{iceicebaby}"
    }
  ]

  for flag in flags:
    if flag['challengeSolution'] == challengeSolution:
      return flag['flag']
  return 'Incorrect Challenge Solution'

@csrf_exempt
def flagCheck(request):
  if request.method == 'POST':
    form = json.loads(request.body.decode('utf-8'))

    res = getFlag(form['flag'])
    success={'flag': res}
    return JsonResponse(success, status=200)


