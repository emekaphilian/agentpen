interface EmptyStateProps {
  title?: string
  description?: string
}

export default function EmptyState({
  title = 'No systems registered yet.',
  description = 'Use the form to add the first AI system to the registry.'
}: EmptyStateProps) {
  return (
    <div className="empty">
      <div className="empty-icon">🧾</div>
      <p>{title}</p>
      <div>{description}</div>
    </div>
  )
}
