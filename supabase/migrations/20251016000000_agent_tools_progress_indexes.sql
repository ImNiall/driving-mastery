create index if not exists idx_question_attempts_user_created
  on question_attempts(user_id, created_at);

create index if not exists idx_question_attempts_user_answered
  on question_attempts(user_id, answered_at);

create index if not exists idx_question_attempts_topic
  on question_attempts(topic);

create index if not exists idx_quiz_attempts_user_created
  on quiz_attempts(user_id, created_at);

create index if not exists idx_quiz_attempts_user_attempted
  on quiz_attempts(user_id, attempted_at);
