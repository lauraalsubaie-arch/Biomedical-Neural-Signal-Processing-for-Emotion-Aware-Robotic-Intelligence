const faqs=[
["How is Calmy designed for real backend data?","All reads and writes go through src/services/api.js. Replace the localStorage mock with fetch/WebSocket calls without changing page logic."],
["How will live sensor data connect?","The hook useLiveSensorData currently polls api.getLiveSensorData. In production, replace it with WebSocket/SSE streaming from EEG/PPG services."],
["Is the dashboard diagnostic?","No. It provides monitoring and decision-support summaries. Clinical diagnosis must be made by qualified professionals."],
["What patient portal features are included?","Appointments, secure messages, notifications, medical reports, session history, profile management, and doctor booking."],
["What doctor features are included?","Assigned patient list, priority queue, report editing, feedback, appointment management, and secure chat."],
["How is validation handled?","Auth, appointment booking, and messaging use explicit validation utilities. Backend validation should mirror these rules."],
];
export default function Help(){return <div><div className="page-title-block"><h2>Help & FAQ</h2><p>Production notes and user guidance.</p></div><div className="faq-list">{faqs.map(([q,a])=><details key={q} className="faq"><summary>{q}</summary><p>{a}</p></details>)}</div></div>}
