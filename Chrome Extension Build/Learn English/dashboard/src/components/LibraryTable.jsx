export default function LibraryTable({ items, onDelete, onEdit }) {
  return (
    <section className="panel">
      <h3>Vocabulary Library</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Term</th>
              <th>Meaning</th>
              <th>Source</th>
              <th>Tags</th>
              <th>Mastery</th>
              <th>Added</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td>{item.term}</td>
                <td>{item.meaning || ""}</td>
                <td>
                  {item.sourceUrl ? (
                    <a href={item.sourceUrl} target="_blank" rel="noreferrer">
                      {item.sourceTitle || item.sourceUrl}
                    </a>
                  ) : (
                    item.sourceTitle || ""
                  )}
                </td>
                <td>{(item.tags || []).join(", ")}</td>
                <td>{item.masteryLevel || 0}</td>
                <td>{new Date(item.addedAt || item.createdAt).toLocaleString()}</td>
                <td>
                  <div className="row-actions">
                    <button onClick={() => onEdit(item)}>Edit</button>
                    <button className="danger" onClick={() => onDelete(item._id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
