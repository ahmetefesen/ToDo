from django.urls import path
from .views import (
    TaskList, TaskDetail, TaskCreate, TaskUpdate, DeleteView, CustomLoginView, RegisterPage, TaskReorder,
    TaskListCreateAPI, TaskDetailAPI,
    UserProfileListCreateAPI, UserProfileDetailAPI,
    TeamListCreateAPI, TeamDetailAPI,
    TaskCommentListCreateAPI, TaskCommentDetailAPI,
    TaskAttachmentListCreateAPI, TaskAttachmentDetailAPI,
    TaskPriorityListCreateAPI, TaskPriorityDetailAPI,
    TaskScheduleListCreateAPI, TaskScheduleDetailAPI,
    TaskRecurrenceListCreateAPI, TaskRecurrenceDetailAPI,
    TaskDependenceListCreateAPI, TaskDependenceDetailAPI,
    HistoryListCreateAPI, HistoryDetailAPI,
    TaskReportListCreateAPI, TaskReportDetailAPI,
    UserTeamsListCreateAPI, UserTeamsDetailAPI
)
from django.contrib.auth.views import LogoutView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('login/', CustomLoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(next_page='login'), name='logout'),
    path('register/', RegisterPage.as_view(), name='register'),

    path('', TaskList.as_view(), name='tasks'),
    path('task/<int:pk>/', TaskDetail.as_view(), name='task'),
    path('task-create/', TaskCreate.as_view(), name='task-create'),
    path('task-update/<int:pk>/', TaskUpdate.as_view(), name='task-update'),
    path('task-delete/<int:pk>/', DeleteView.as_view(), name='task-delete'),
    path('task-reorder/', TaskReorder.as_view(), name='task-reorder'),

    # REST API endpointleri
    path('api/tasks/', TaskListCreateAPI.as_view(), name='api-task-list-create'),
    path('api/tasks/<int:pk>/', TaskDetailAPI.as_view(), name='api-task-detail'),

    path('api/userprofiles/', UserProfileListCreateAPI.as_view(), name='api-userprofile-list-create'),
    path('api/userprofiles/<int:pk>/', UserProfileDetailAPI.as_view(), name='api-userprofile-detail'),

    path('api/teams/', TeamListCreateAPI.as_view(), name='api-team-list-create'),
    path('api/teams/<int:pk>/', TeamDetailAPI.as_view(), name='api-team-detail'),

    path('api/taskcomments/', TaskCommentListCreateAPI.as_view(), name='api-taskcomment-list-create'),
    path('api/taskcomments/<int:pk>/', TaskCommentDetailAPI.as_view(), name='api-taskcomment-detail'),

    path('api/taskattachments/', TaskAttachmentListCreateAPI.as_view(), name='api-taskattachment-list-create'),
    path('api/taskattachments/<int:pk>/', TaskAttachmentDetailAPI.as_view(), name='api-taskattachment-detail'),

    path('api/taskpriorities/', TaskPriorityListCreateAPI.as_view(), name='api-taskpriority-list-create'),
    path('api/taskpriorities/<int:pk>/', TaskPriorityDetailAPI.as_view(), name='api-taskpriority-detail'),

    path('api/taskschedules/', TaskScheduleListCreateAPI.as_view(), name='api-taskschedule-list-create'),
    path('api/taskschedules/<int:pk>/', TaskScheduleDetailAPI.as_view(), name='api-taskschedule-detail'),

    path('api/taskrecurrences/', TaskRecurrenceListCreateAPI.as_view(), name='api-taskrecurrence-list-create'),
    path('api/taskrecurrences/<int:pk>/', TaskRecurrenceDetailAPI.as_view(), name='api-taskrecurrence-detail'),

    path('api/taskdependences/', TaskDependenceListCreateAPI.as_view(), name='api-taskdependence-list-create'),
    path('api/taskdependences/<int:pk>/', TaskDependenceDetailAPI.as_view(), name='api-taskdependence-detail'),

    path('api/histories/', HistoryListCreateAPI.as_view(), name='api-history-list-create'),
    path('api/histories/<int:pk>/', HistoryDetailAPI.as_view(), name='api-history-detail'),

    path('api/taskreports/', TaskReportListCreateAPI.as_view(), name='api-taskreport-list-create'),
    path('api/taskreports/<int:pk>/', TaskReportDetailAPI.as_view(), name='api-taskreport-detail'),

    path('api/userteams/', UserTeamsListCreateAPI.as_view(), name='api-userteams-list-create'),
    path('api/userteams/<int:pk>/', UserTeamsDetailAPI.as_view(), name='api-userteams-detail'),

    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
