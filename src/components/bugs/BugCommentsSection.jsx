import { useState } from 'react';
import { DEMO_USER_NAME } from '../../constants/user';
import { Button } from '../ui/Button';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Textarea } from '../ui/Input';

function canManageComment(comment) {
  return (comment.author || DEMO_USER_NAME) === DEMO_USER_NAME;
}

function CommentItem({ comment, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [editError, setEditError] = useState('');
  const owned = canManageComment(comment);

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const trimmed = editText.trim();
    if (!trimmed) {
      setEditError('Comment cannot be empty.');
      return;
    }
    onEdit(comment.id, trimmed);
    setEditing(false);
    setEditError('');
  };

  const handleCancelEdit = () => {
    setEditText(comment.text);
    setEditing(false);
    setEditError('');
  };

  const handleDelete = () => {
    if (window.confirm('Delete this comment?')) {
      onDelete(comment.id);
    }
  };

  return (
    <li
      className="rounded-lg border border-stripe-border bg-stripe-bg px-4 py-3"
      data-testid={`bug-comment-${comment.id}`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-sm font-medium text-stripe-ink">
          {comment.author || DEMO_USER_NAME}
        </span>
        <div className="flex items-center gap-2">
          {comment.editedAt && (
            <span className="text-xs text-stripe-faint">(edited)</span>
          )}
          <time className="text-xs text-stripe-faint">
            {new Date(comment.createdAt).toLocaleString()}
          </time>
        </div>
      </div>

      {editing ? (
        <form onSubmit={handleSaveEdit} className="mt-3 space-y-2">
          <textarea
            data-testid={`bug-comment-edit-input-${comment.id}`}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={3}
            className="stripe-input w-full"
          />
          {editError && <p className="text-sm text-red-600">{editError}</p>}
          <div className="flex flex-wrap gap-2">
            <Button type="submit" size="sm" data-testid={`bug-comment-save-${comment.id}`}>
              Save
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleCancelEdit}
              data-testid={`bug-comment-cancel-edit-${comment.id}`}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <>
          <p className="mt-2 whitespace-pre-wrap text-sm text-stripe-muted">{comment.text}</p>
          {owned && (
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                data-testid={`bug-comment-edit-${comment.id}`}
                onClick={() => setEditing(true)}
                className="text-xs font-medium text-stripe-accent hover:underline"
              >
                Edit
              </button>
              <button
                type="button"
                data-testid={`bug-comment-delete-${comment.id}`}
                onClick={handleDelete}
                className="text-xs font-medium text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          )}
        </>
      )}
    </li>
  );
}

export function BugCommentsSection({
  comments = [],
  onAddComment,
  onEditComment,
  onDeleteComment,
}) {
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) {
      setError('Enter a comment before posting.');
      return;
    }
    onAddComment(trimmed);
    setDraft('');
    setError('');
  };

  return (
    <Card data-testid="bug-comments-card">
      <CardHeader
        title="Comments"
        subtitle={`${comments.length} comment${comments.length !== 1 ? 's' : ''}`}
      />
      <CardBody className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-stripe-muted" data-testid="bug-comments-empty">
            No comments yet. Add notes for QA, dev, or product.
          </p>
        ) : (
          <ul className="space-y-3" data-testid="bug-comments-list">
            {[...comments]
              .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
              .map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onEdit={onEditComment}
                  onDelete={onDeleteComment}
                />
              ))}
          </ul>
        )}

        <form onSubmit={handleSubmit} className="border-t border-stripe-border pt-4">
          <Textarea
            label="Add a comment"
            data-testid="bug-comment-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write an update…"
            rows={3}
          />
          {error && (
            <p className="mt-1 text-sm text-red-600" data-testid="bug-comment-error">
              {error}
            </p>
          )}
          <Button type="submit" data-testid="bug-comment-submit" className="mt-3">
            Post comment
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
