import { useState } from 'react';
import './App.css';
import { api } from './api';
import type { IUser } from './types';
import { Trash2, UserPlus, RefreshCw, Users, Fingerprint, Search } from 'lucide-react';

function App() {
    const [activeTab, setActiveTab] = useState<'users' | 'gender'>('users');
    const [users, setUsers] = useState<IUser[]>([]);
    const [genderName, setGenderName] = useState('');
    const [genderResult, setGenderResult] = useState<any>(null);

    const loadUsers = async () => {
        const data = await api.getUsers(6);
        setUsers(data);
    };

    const handleAddUser = async () => {
        const name = prompt('Введите имя сотруд intelligence:');
        if (!name) return;

        const cleanName = name.toLowerCase().replace(/\s+/g, '_');
        const domains = ['gmail.com', 'outlook.com', 'yandex.ru', 'mail.ru'];
        const randomEmail = `${cleanName}@${domains[Math.floor(Math.random() * domains.length)]}`;

        await api.createFact(name); 

        const newUser: IUser = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            email: randomEmail,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
            location: 'Russia'
        };
        setUsers([newUser, ...users]);
    };

    const handleDelete = async (id: string | number) => {
        await api.deleteFact(id);
        setUsers(users.filter(u => u.id !== id));
    };

    return (
        <div className="app-wrapper">
            <header className="header">
                <div className="header-inner">
                    <div className="logo">Лабораторная работа №7</div>
                    <nav className="nav">
                        <button onClick={() => setActiveTab('users')} className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}>
                            <Users size={18} style={{marginRight: '6px'}}/> Пользователи
                        </button>
                        <button onClick={() => setActiveTab('gender')} className={`nav-btn ${activeTab === 'gender' ? 'active' : ''}`}>
                            <Fingerprint size={18} style={{marginRight: '6px'}}/> Анализ пола
                        </button>
                    </nav>
                </div>
            </header>

            <main className="container">
                {activeTab === 'users' && (
                    <section className="fade-in">
                        <div className="top-bar" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
                            <h2 style={{fontWeight: 800, margin: 0}}>Пользователи</h2>
                            <div style={{display: 'flex', gap: '10px'}}>
                                <button className="btn-primary" style={{background: 'rgba(255,255,255,0.4)', color: '#1e293b'}} onClick={loadUsers}>
                                    <RefreshCw size={18}/>
                                </button>
                                <button className="btn-primary" onClick={handleAddUser}>
                                    <UserPlus size={18}/> Добавить
                                </button>
                            </div>
                        </div>
                        <div className="grid">
                            {users.map(u => (
                                <div key={u.id} className="card">
                                    <div className="user-content" style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                                        <img src={u.avatar} className="user-avatar" alt="pfp" />
                                        <div className="user-info" style={{flex: 1}}>
                                            <h3 style={{margin: 0}}>{u.name}</h3>
                                            <p style={{margin: '2px 0', fontSize: '0.85rem', opacity: 0.7}}>{u.email}</p>
                                            <p style={{margin: 0, fontSize: '0.8rem'}}>📍 {u.location}</p>
                                        </div>
                                        <button className="btn-delete" onClick={() => handleDelete(u.id)}>
                                            <Trash2 size={18}/>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {activeTab === 'gender' && (
                    <section className="fade-in">
                        <div className="card search-card">
                            <div style={{fontSize: '50px', marginBottom: '15px'}}>🧬</div>
                            <h2 style={{fontWeight: 800}}>Анализ пола</h2>
                            <p style={{opacity: 0.6, marginBottom: '25px'}}>Определение пола по имени (введите на английском)</p>
                            
                            <input 
                                type="text" 
                                placeholder="Введите имя..." 
                                value={genderName}
                                onChange={(e) => setGenderName(e.target.value)}
                            />
                            <button className="btn-primary" style={{width: '100%', justifyContent: 'center'}} onClick={() => api.getGender(genderName).then(setGenderResult)}>
                                <Search size={20} style={{marginRight: '10px'}}/> Анализировать
                            </button>

                            {genderResult && (
                                <div style={{marginTop: '30px', padding: '25px', background: 'rgba(255,255,255,0.3)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.2)'}}>
                                    <div style={{fontSize: '40px'}}>{genderResult.gender === 'male' ? '👨' : '👩'}</div>
                                    <h3 style={{fontSize: '1.4rem', margin: '10px 0'}}>{genderResult.genderRu}</h3>
                                    <div style={{background: 'rgba(0,0,0,0.1)', height: '8px', borderRadius: '4px', overflow: 'hidden', margin: '15px 0'}}>
                                        <div style={{width: `${genderResult.probability * 100}%`, background: 'var(--primary)', height: '100%'}}></div>
                                    </div>
                                    <p style={{fontSize: '0.9rem', fontWeight: 600}}>Вероятность: {Math.round(genderResult.probability * 100)}%</p>
                                </div>
                            )}
                        </div>
                    </section>
                )}
            </main>

            <footer className="footer">
                <p style={{fontWeight: 700, margin: 0}}>Лабораторная работа №7</p>
                <p style={{opacity: 0.6, fontSize: '0.85rem'}}>РХТУ 2026</p>
            </footer>
        </div>
    );
}

export default App;