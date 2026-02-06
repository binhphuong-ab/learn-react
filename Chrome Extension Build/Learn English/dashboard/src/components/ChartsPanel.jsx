import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  Legend
} from "recharts";

const COLORS = ["#2d6a4f", "#40916c", "#f77f00", "#ef476f", "#1d3557", "#2a9d8f"];

export default function ChartsPanel({ charts }) {
  const progress = charts?.progress || [];
  const byTag = charts?.byTag || [];
  const accuracyTrend = charts?.accuracyTrend || [];

  return (
    <section className="panel-grid">
      <article className="panel">
        <h3>Learning Progress</h3>
        <div className="chart-box">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={progress}>
              <CartesianGrid strokeDasharray="2 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#2d6a4f" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="panel">
        <h3>Words by Tag</h3>
        <div className="chart-box">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={byTag} dataKey="value" nameKey="tag" outerRadius={90} label>
                {byTag.map((entry, index) => (
                  <Cell key={`${entry.tag}-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="panel panel-wide">
        <h3>Review Accuracy Trend</h3>
        <div className="chart-box">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={accuracyTrend}>
              <CartesianGrid strokeDasharray="2 3" />
              <XAxis dataKey="term" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="accuracy" fill="#f77f00" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  );
}
