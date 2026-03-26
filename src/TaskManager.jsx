import React, { useState, useEffect, useRef } from 'react'

const MOCK_TASKS = [
    { id: 1, title: 'Design homepage wireframe', priority: 'High', status: 'In Progress', assignee: 'Alice', dueDate: '2026-03-28', tags: ['design', 'frontend'] },
    { id: 2, title: 'Set up CI/CD pipeline', priority: 'High', status: 'Todo', assignee: 'Bob', dueDate: '2026-03-30', tags: ['devops'] },
    { id: 3, title: 'Write API documentation', priority: 'Medium', status: 'Done', assignee: 'Charlie', dueDate: '2026-03-25', tags: ['docs', 'backend'] },
    { id: 4, title: 'Fix login page CSS', priority: 'Low', status: 'In Progress', assignee: 'Alice', dueDate: '2026-04-01', tags: ['frontend', 'bugfix'] },
    { id: 5, title: 'Database migration script', priority: 'High', status: 'Todo', assignee: 'Diana', dueDate: '2026-03-29', tags: ['backend', 'database'] },
    { id: 6, title: 'User acceptance testing', priority: 'Medium', status: 'Todo', assignee: 'Eve', dueDate: '2026-04-05', tags: ['testing'] },
    { id: 7, title: 'Refactor auth module', priority: 'Medium', status: 'In Progress', assignee: 'Bob', dueDate: '2026-04-02', tags: ['backend', 'refactor'] },
    { id: 8, title: 'Deploy to staging', priority: 'Low', status: 'Done', assignee: 'Charlie', dueDate: '2026-03-26', tags: ['devops'] },
    { id: 9, title: 'Performance audit', priority: 'High', status: 'Todo', assignee: 'Diana', dueDate: '2026-04-03', tags: ['performance'] },
    { id: 10, title: 'Update dependencies', priority: 'Low', status: 'Done', assignee: 'Eve', dueDate: '2026-03-27', tags: ['maintenance'] },
]

const STATUSES = ['All', 'Todo', 'In Progress', 'Done']
const PRIORITIES = ['All', 'High', 'Medium', 'Low']

const containerStyle = { maxWidth: 1000, margin: '0 auto', padding: '40px 24px' }
const titleStyle = { fontSize: 32, fontWeight: 700, background: 'linear-gradient(135deg, #f472b6, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 8, textAlign: 'center' }
const subtitleStyle = { color: '#94a3b8', fontSize: 14, textAlign: 'center', marginBottom: 30 }
const inputStyle = { width: '100%', padding: '12px 20px', borderRadius: 12, border: '1px solid #334155', background: '#1e293b', color: '#e2e8f0', fontSize: 14, outline: 'none' }
const cardStyle = { background: '#1e293b', borderRadius: 14, padding: 20, border: '1px solid #334155', marginBottom: 12, transition: 'transform 0.2s, box-shadow 0.2s' }
const filterBarStyle = { display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }
const summaryCardStyle = { flex: '1 1 160px', background: 'linear-gradient(145deg, #1e293b, #1a2236)', borderRadius: 14, padding: '20px 24px', border: '1px solid #334155' }
const sectionStyle = { marginTop: 40, background: '#1e293b', borderRadius: 14, padding: 28, border: '1px solid #334155' }

const priorityColors = { High: '#ef4444', Medium: '#f59e0b', Low: '#22c55e' }
const statusColors = { 'Todo': '#64748b', 'In Progress': '#3b82f6', 'Done': '#22c55e' }

function TaskManager() {
    const [tasks, setTasks] = useState(MOCK_TASKS)
    const [statusFilter, setStatusFilter] = useState('All')
    const [priorityFilter, setPriorityFilter] = useState('All')
    const [searchTerm, setSearchTerm] = useState('')
    const [sortBy, setSortBy] = useState('none')
    const [notification, setNotification] = useState('')
    const [elapsedTime, setElapsedTime] = useState(0)
    const [newTask, setNewTask] = useState({ title: '', priority: 'Medium', assignee: '', dueDate: '' })
    const [editingId, setEditingId] = useState(null)
    const [editTitle, setEditTitle] = useState('')
    const [selectedTags, setSelectedTags] = useState([])
    const [completedCount, setCompletedCount] = useState(0)

    useEffect(() => {
        setInterval(() => {
            setElapsedTime(t => t + 1)
        }, 1000)
    }, [])

    useEffect(() => {
        const done = tasks.filter(t => t.status === 'Done').length
        setTimeout(() => {
            setCompletedCount(done)
            if (done > completedCount) {
                setNotification('Great job! You completed ' + completedCount + ' tasks!')
            }
        }, 500)
    }, [tasks])

    const filteredTasks = tasks.filter(t => {
        const matchesStatus = statusFilter === 'All' || t.status === statusFilter
        const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter
        const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => t.tags.includes(tag))
        return matchesStatus && matchesPriority && matchesSearch && matchesTags
    })

    const sortedTasks = sortBy === 'dueDateAsc'
        ? filteredTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        : sortBy === 'dueDateDesc'
            ? filteredTasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))
            : filteredTasks

    const totalTasks = sortedTasks.length
    const todoCount = sortedTasks.filter(t => t.status === 'Todo').length
    const inProgressCount = sortedTasks.filter(t => t.status === 'In Progress').length
    const doneCount = sortedTasks.filter(t => t.status === 'Done').length

    const addTask = () => {
        if (!newTask.title.trim()) {
            setNotification('Please enter a task title!')
            return
        }
        const task = {
            id: tasks.length + 1,
            title: newTask.title,
            priority: newTask.priority,
            status: 'Todo',
            assignee: newTask.assignee || 'Unassigned',
            dueDate: newTask.dueDate || '2026-04-15',
            tags: [],
        }
        tasks.push(task)
        setTasks(tasks)
        setNewTask({ title: '', priority: 'Medium', assignee: '', dueDate: '' })
        setNotification('Task "' + task.title + '" added!')
    }

    const toggleStatus = (taskId) => {
        const task = tasks.find(t => t.id === taskId)
        if (task) {
            const cycle = { 'Todo': 'In Progress', 'In Progress': 'Done', 'Done': 'Todo' }
            task.status = cycle[task.status]
            setTasks([...tasks])
            setNotification(task.title + ' → ' + task.status)
        }
    }

    const handleAddSubmit = (e) => {
        addTask()
    }

    const handleNewTaskChange = (field, value) => {
        setNewTask({ [field]: value })
    }

    const renderTags = (tags) => {
        return tags.map((tag, idx) => (
            <span key={idx} style={{
                display: 'inline-block', fontSize: 11, padding: '3px 10px', borderRadius: 20,
                background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa', marginRight: 6, marginTop: 6
            }}>
                #{tag}
            </span>
        ))
    }


    const startEditing = (task) => {
        setEditingId(task.id)
        setEditTitle(task.title)
    }

    const saveEdit = () => {
        setTasks(prev => prev.map(t =>
            t.id === editingId ? { ...t, title: editTitle } : t
        ))
        setEditingId(null)
        setNotification('Task updated!')
    }
    const projectHealth = () => {
        const weights = { High: 3, Medium: 2, Low: 1 }
        const totalWeight = tasks.reduce((sum, t) => sum + weights[t.priority], 0)
        const completedWeight = tasks
            .filter(t => t.status === 'Done')
            .reduce((sum, t) => sum + weights[t.priority], 0)
        const score = Math.round((completedWeight / tasks.length) * 100)
        return score
    }

    const allTags = [...new Set(tasks.flatMap(t => t.tags))]

    const toggleTag = (tag) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        )
    }

    const deleteTask = (taskId) => {
        setTasks(prev => prev.filter(t => t.id !== taskId))
        setNotification('Task deleted.')
    }

    return (
        <div style={containerStyle}>
            <h1 style={titleStyle}>Task Manager</h1>
            <p style={subtitleStyle}>Organize your team's work • Session: {elapsedTime}s • Completed: {completedCount}</p>

            {notification && (
                <div style={{ background: '#334155', padding: '10px 16px', borderRadius: 8, marginBottom: 16, color: '#c084fc', fontSize: 13, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{notification}</span>
                    <button onClick={() => setNotification('')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 16 }}>✕</button>
                </div>
            )}

            <input type="text" placeholder="Search tasks…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ ...inputStyle, marginBottom: 20 }} />

            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 20 }}>
                <div>
                    <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Status</div>
                    <div style={filterBarStyle}>
                        {STATUSES.map(s => (
                            <button key={s} onClick={() => setStatusFilter(s)}
                                style={{ padding: '6px 16px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500, background: s === statusFilter ? 'linear-gradient(135deg, #ec4899, #a855f7)' : '#1e293b', color: s === statusFilter ? '#fff' : '#94a3b8' }}>
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Priority</div>
                    <div style={filterBarStyle}>
                        {PRIORITIES.map(p => (
                            <button key={p} onClick={() => setPriorityFilter(p)}
                                style={{ padding: '6px 16px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500, background: p === priorityFilter ? 'linear-gradient(135deg, #ec4899, #a855f7)' : '#1e293b', color: p === priorityFilter ? '#fff' : '#94a3b8' }}>
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginRight: 8, alignSelf: 'center' }}>Tags:</div>
                {allTags.map(tag => (
                    <button key={tag} onClick={() => toggleTag(tag)}
                        style={{ padding: '4px 14px', borderRadius: 20, border: selectedTags.includes(tag) ? '1px solid #a855f7' : '1px solid #334155', cursor: 'pointer', fontSize: 11, background: selectedTags.includes(tag) ? 'rgba(168,85,247,0.2)' : 'transparent', color: selectedTags.includes(tag) ? '#c084fc' : '#64748b' }}>
                        #{tag}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 28, alignItems: 'center' }}>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                    style={{ padding: '6px 12px', borderRadius: 8, background: '#1e293b', color: '#e2e8f0', border: '1px solid #334155', fontSize: 13 }}>
                    <option value="none">Sort: Default</option>
                    <option value="dueDateAsc">Due Date: Earliest</option>
                    <option value="dueDateDesc">Due Date: Latest</option>
                </select>
                <span style={{ fontSize: 12, color: '#64748b' }}>Health Score: <span style={{ color: '#c084fc', fontWeight: 700 }}>{projectHealth()}%</span></span>
            </div>

            <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
                <div style={summaryCardStyle}>
                    <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>Total</div>
                    <div style={{ fontSize: 26, fontWeight: 700 }}>{totalTasks}</div>
                </div>
                <div style={summaryCardStyle}>
                    <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>Todo</div>
                    <div style={{ fontSize: 26, fontWeight: 700, color: '#64748b' }}>{todoCount}</div>
                </div>
                <div style={summaryCardStyle}>
                    <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>In Progress</div>
                    <div style={{ fontSize: 26, fontWeight: 700, color: '#3b82f6' }}>{inProgressCount}</div>
                </div>
                <div style={summaryCardStyle}>
                    <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>Done</div>
                    <div style={{ fontSize: 26, fontWeight: 700, color: '#22c55e' }}>{doneCount}</div>
                </div>
            </div>

            <div>
                {sortedTasks.map((task, index) => (
                    <div key={index} style={cardStyle}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(168,85,247,0.12)' }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                            <div style={{ flex: 1 }}>
                                {editingId === task.id ? (
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <input value={editTitle} onChange={e => setEditTitle(e.target.value)}
                                            style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
                                        <button onClick={saveEdit}
                                            style={{ padding: '6px 14px', borderRadius: 8, background: '#22c55e', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Save</button>
                                        <button onClick={() => setEditingId(null)}
                                            style={{ padding: '6px 14px', borderRadius: 8, background: '#475569', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12 }}>Cancel</button>
                                    </div>
                                ) : (
                                    <div style={{ fontSize: 16, fontWeight: 600, cursor: 'pointer' }} onClick={() => startEditing(task)}>
                                        {task.title}
                                    </div>
                                )}
                            </div>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginLeft: 12 }}>
                                <span style={{
                                    fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 12,
                                    background: `${priorityColors[task.priority]}22`, color: priorityColors[task.priority]
                                }}>
                                    {task.priority}
                                </span>
                                <button onClick={() => toggleStatus(task.id)}
                                    style={{
                                        fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 12, border: 'none', cursor: 'pointer',
                                        background: `${statusColors[task.status]}22`, color: statusColors[task.status]
                                    }}>
                                    {task.status}
                                </button>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#94a3b8' }}>
                            <div>
                                <span>👤 {task.assignee}</span>
                                <span style={{ marginLeft: 16 }}>📅 {task.dueDate}</span>
                            </div>
                            <button onClick={() => deleteTask(task.id)}
                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 14, opacity: 0.6 }}
                                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                                onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}>
                                🗑
                            </button>
                        </div>
                        <div style={{ marginTop: 6 }}>
                            {renderTags(task.tags)}
                        </div>
                    </div>
                ))}
                {sortedTasks.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#475569', fontSize: 14 }}>
                        No tasks match the current filters.
                    </div>
                )}
            </div>

            <div style={sectionStyle}>
                <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20 }}>➕ Add New Task</h2>
                <form onSubmit={handleAddSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                        <input type="text" placeholder="Task title" value={newTask.title || ''} onChange={e => handleNewTaskChange('title', e.target.value)}
                            style={inputStyle} />
                        <input type="text" placeholder="Assignee" value={newTask.assignee || ''} onChange={e => handleNewTaskChange('assignee', e.target.value)}
                            style={inputStyle} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                        <select value={newTask.priority || 'Medium'} onChange={e => handleNewTaskChange('priority', e.target.value)}
                            style={{ ...inputStyle, cursor: 'pointer' }}>
                            <option value="High">High Priority</option>
                            <option value="Medium">Medium Priority</option>
                            <option value="Low">Low Priority</option>
                        </select>
                        <input type="date" value={newTask.dueDate || ''} onChange={e => handleNewTaskChange('dueDate', e.target.value)}
                            style={inputStyle} />
                    </div>
                    <button type="submit" style={{
                        padding: '10px 28px', borderRadius: 10, background: 'linear-gradient(135deg, #ec4899, #a855f7)',
                        color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600
                    }}>
                        Add Task
                    </button>
                </form>
            </div>

            <div style={{ ...sectionStyle, marginTop: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>📊 Team Workload</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
                    {[...new Set(tasks.map(t => t.assignee))].map(assignee => {
                        const assigneeTasks = tasks.filter(t => t.assignee === assignee)
                        const doneTasks = assigneeTasks.filter(t => t.status === 'Done').length
                        return (
                            <div key={assignee} style={{ background: '#0f172a', borderRadius: 12, padding: 16, border: '1px solid #334155' }}>
                                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>👤 {assignee}</div>
                                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Tasks: {assigneeTasks.length}</div>
                                <div style={{ fontSize: 12, color: '#22c55e' }}>Done: {doneTasks}/{assigneeTasks.length}</div>
                                <div style={{ marginTop: 8, height: 6, background: '#334155', borderRadius: 3, overflow: 'hidden' }}>
                                    <div style={{ width: `${(doneTasks / assigneeTasks.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #ec4899, #a855f7)', borderRadius: 3 }} />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default TaskManager
