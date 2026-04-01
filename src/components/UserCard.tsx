import React from 'react';
import { Trash2, Mail, MapPin } from 'lucide-react'; 

interface UserCardProps {
  user: {
    id: string;
    name: string;
    email: string;
    location: string;
    avatar: string;
  };
  onDelete: (id: string) => void; 
}

const UserCard: React.FC<UserCardProps> = ({ user, onDelete }) => {
  return (
    <div className="card user-card fade-in">
      <img src={user.avatar} alt="avatar" className="user-avatar" />
      <div className="user-info">
        <h3>{user.name}</h3>
        <p><Mail size={14} /> {user.email}</p>
        <p><MapPin size={14} /> {user.location}</p>
        <button className="btn-icon delete" onClick={() => onDelete(user.id)}>
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default UserCard;