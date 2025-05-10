import type { UserInstance } from "../../models/user";
import AuthSession from "../../utils/session";
import "../profileCalendar.scss";
import avatar from "../../assets/react.svg";

type ProfileCardProps = {
    profile: UserInstance;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
};

const ProfileCard = ({ profile, toggleDarkMode, isDarkMode }: ProfileCardProps) => {
  const fallbackRole = localStorage.getItem("__smartmaple__user__roles__")?.replace(/^"|"$/g, '');;
  const roleToDisplay = profile?.role?.name || fallbackRole;

  const fallbackName = localStorage.getItem("__smartmaple__user__name__")?.replace(/^"|"$/g, '');;
  const nameToDisplay = profile?.name || fallbackName;

  return (
    <div className="profile-section">
      <div>
        <img
          src={avatar}
          alt="Kullanıcı Avatarı"
          style={{ borderRadius: "50%", width: 80, height: 80 }}
        />
      </div>
      <div className="profile-info">
        <h2>Welcome, {nameToDisplay}</h2>
        <p>{profile?.email ?? AuthSession.getEmail()}</p>
        <p>{roleToDisplay ?? AuthSession.getRoles()}</p>
      </div>

      <div className="header-controls">
        <button 
          className="theme-toggle"
          onClick={toggleDarkMode}
        >
          {isDarkMode ? '🌞' : '🌙'}
        </button>
        <button 
          className="profile-button"
          onClick={() => window.open('https://www.linkedin.com/in/krbckoguzhan/', '_blank')}
        >
          Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;