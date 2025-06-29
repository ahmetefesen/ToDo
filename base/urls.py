from django.urls import path, include
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
    UserTeamsListCreateAPI, UserTeamsDetailAPI,
    custom_logout,
    TaskToggleCompleteView
)
from django.contrib.auth.views import LogoutView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

# API Version 1
api_v1_patterns = [
    path('tasks/', TaskListCreateAPI.as_view(), name='api-task-list-create'),
    path('tasks/<int:pk>/', TaskDetailAPI.as_view(), name='api-task-detail'),
    path('tasks/<int:pk>/toggle/', TaskToggleCompleteView.as_view(), name='api-task-toggle'),

    path('userprofiles/', UserProfileListCreateAPI.as_view(), name='api-userprofile-list-create'),
    path('userprofiles/<int:pk>/', UserProfileDetailAPI.as_view(), name='api-userprofile-detail'),

    path('teams/', TeamListCreateAPI.as_view(), name='api-team-list-create'),
    path('teams/<int:pk>/', TeamDetailAPI.as_view(), name='api-team-detail'),

    path('taskcomments/', TaskCommentListCreateAPI.as_view(), name='api-taskcomment-list-create'),
    path('taskcomments/<int:pk>/', TaskCommentDetailAPI.as_view(), name='api-taskcomment-detail'),

    path('taskattachments/', TaskAttachmentListCreateAPI.as_view(), name='api-taskattachment-list-create'),
    path('taskattachments/<int:pk>/', TaskAttachmentDetailAPI.as_view(), name='api-taskattachment-detail'),

    path('taskpriorities/', TaskPriorityListCreateAPI.as_view(), name='api-taskpriority-list-create'),
    path('taskpriorities/<int:pk>/', TaskPriorityDetailAPI.as_view(), name='api-taskpriority-detail'),

    path('taskschedules/', TaskScheduleListCreateAPI.as_view(), name='api-taskschedule-list-create'),
    path('taskschedules/<int:pk>/', TaskScheduleDetailAPI.as_view(), name='api-taskschedule-detail'),

    path('taskrecurrences/', TaskRecurrenceListCreateAPI.as_view(), name='api-taskrecurrence-list-create'),
    path('taskrecurrences/<int:pk>/', TaskRecurrenceDetailAPI.as_view(), name='api-taskrecurrence-detail'),

    path('taskdependences/', TaskDependenceListCreateAPI.as_view(), name='api-taskdependence-list-create'),
    path('taskdependences/<int:pk>/', TaskDependenceDetailAPI.as_view(), name='api-taskdependence-detail'),

    path('histories/', HistoryListCreateAPI.as_view(), name='api-history-list-create'),
    path('histories/<int:pk>/', HistoryDetailAPI.as_view(), name='api-history-detail'),

    path('taskreports/', TaskReportListCreateAPI.as_view(), name='api-taskreport-list-create'),
    path('taskreports/<int:pk>/', TaskReportDetailAPI.as_view(), name='api-taskreport-detail'),

    path('userteams/', UserTeamsListCreateAPI.as_view(), name='api-userteams-list-create'),
    path('userteams/<int:pk>/', UserTeamsDetailAPI.as_view(), name='api-userteams-detail'),
]

urlpatterns = [
    path('login/', CustomLoginView.as_view(), name='login'),
    path('logout/', custom_logout, name='logout'),
    path('register/', RegisterPage.as_view(), name='register'),

    path('', TaskList.as_view(), name='tasks'),
    path('task/<int:pk>/', TaskDetail.as_view(), name='task'),
    path('task-create/', TaskCreate.as_view(), name='task-create'),
    path('task-update/<int:pk>/', TaskUpdate.as_view(), name='task-update'),
    path('task-delete/<int:pk>/', DeleteView.as_view(), name='task-delete'),
    path('task-reorder/', TaskReorder.as_view(), name='task-reorder'),
    path('task-toggle-complete/<int:pk>/', TaskToggleCompleteView.as_view(), name='task-toggle-complete'),

    # REST API endpoints with versioning
    path('api/v1/', include(api_v1_patterns)),
    
    # Legacy API endpoints (for backward compatibility)
    path('api/tasks/', TaskListCreateAPI.as_view(), name='api-task-list-create-legacy'),
    path('api/tasks/<int:pk>/', TaskDetailAPI.as_view(), name='api-task-detail-legacy'),
    path('api/tasks/<int:pk>/toggle/', TaskToggleCompleteView.as_view(), name='api-task-toggle-legacy'),

    path('api/userprofiles/', UserProfileListCreateAPI.as_view(), name='api-userprofile-list-create-legacy'),
    path('api/userprofiles/<int:pk>/', UserProfileDetailAPI.as_view(), name='api-userprofile-detail-legacy'),

    path('api/teams/', TeamListCreateAPI.as_view(), name='api-team-list-create-legacy'),
    path('api/teams/<int:pk>/', TeamDetailAPI.as_view(), name='api-team-detail-legacy'),

    path('api/taskcomments/', TaskCommentListCreateAPI.as_view(), name='api-taskcomment-list-create-legacy'),
    path('api/taskcomments/<int:pk>/', TaskCommentDetailAPI.as_view(), name='api-taskcomment-detail-legacy'),

    path('api/taskattachments/', TaskAttachmentListCreateAPI.as_view(), name='api-taskattachment-list-create-legacy'),
    path('api/taskattachments/<int:pk>/', TaskAttachmentDetailAPI.as_view(), name='api-taskattachment-detail-legacy'),

    path('api/taskpriorities/', TaskPriorityListCreateAPI.as_view(), name='api-taskpriority-list-create-legacy'),
    path('api/taskpriorities/<int:pk>/', TaskPriorityDetailAPI.as_view(), name='api-taskpriority-detail-legacy'),

    path('api/taskschedules/', TaskScheduleListCreateAPI.as_view(), name='api-taskschedule-list-create-legacy'),
    path('api/taskschedules/<int:pk>/', TaskScheduleDetailAPI.as_view(), name='api-taskschedule-detail-legacy'),

    path('api/taskrecurrences/', TaskRecurrenceListCreateAPI.as_view(), name='api-taskrecurrence-list-create-legacy'),
    path('api/taskrecurrences/<int:pk>/', TaskRecurrenceDetailAPI.as_view(), name='api-taskrecurrence-detail-legacy'),

    path('api/taskdependences/', TaskDependenceListCreateAPI.as_view(), name='api-taskdependence-list-create-legacy'),
    path('api/taskdependences/<int:pk>/', TaskDependenceDetailAPI.as_view(), name='api-taskdependence-detail-legacy'),

    path('api/histories/', HistoryListCreateAPI.as_view(), name='api-history-list-create-legacy'),
    path('api/histories/<int:pk>/', HistoryDetailAPI.as_view(), name='api-history-detail-legacy'),

    path('api/taskreports/', TaskReportListCreateAPI.as_view(), name='api-taskreport-list-create-legacy'),
    path('api/taskreports/<int:pk>/', TaskReportDetailAPI.as_view(), name='api-taskreport-detail-legacy'),

    path('api/userteams/', UserTeamsListCreateAPI.as_view(), name='api-userteams-list-create-legacy'),
    path('api/userteams/<int:pk>/', UserTeamsDetailAPI.as_view(), name='api-userteams-detail-legacy'),

    # JWT Token endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('api/register/', RegisterPage.as_view(), name='api_register'),
]
