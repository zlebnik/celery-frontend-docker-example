from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from celery.result import AsyncResult
from django_celery_results.models import TaskResult

from .tasks import some_long_task


class TaskViewSet(ViewSet):
    def list(self, request):
        tasks = TaskResult.objects.all()
        return Response([{
            'task_id': t.task_id,
            'task_state': t.status,
            'result': t.result
        } for t in tasks])

    def retrieve(self, request, *args, **kwargs):
        try:
            t = TaskResult.objects.get(task_id=kwargs.get('pk'))
        except TaskResult.DoesNotExist:
            t = AsyncResult(kwargs.get('pk'))
        return Response({
            'task_id': t.task_id,
            'task_state': t.status,
            'result': t.result
        })

    def create(self, request):
        request = some_long_task.delay(request.data['email'])
        return Response({
            'task_id': request.id
        })
