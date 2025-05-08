/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import ProfileCard from "../Profile";
import CalendarContainer from "../Calendar";
import { useTheme } from "../../context/ThemeContext";

import { useSelector } from "react-redux";
import { getAuthUser } from "../../store/auth/selector";
import { getSchedule } from "../../store/schedule/selector";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchSchedule } from "../../store/schedule/actions";
import { setProfile } from "../../store/auth/actions";

import "../profileCalendar.scss";

const ProfileCalendar = () => {
  const dispatch = useDispatch();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const auth = useSelector(getAuthUser);
  const schedule = useSelector(getSchedule);

  useEffect(() => {
    dispatch(setProfile() as any);
    dispatch(fetchSchedule() as any);
  }, []);

  return (
    <div className={`profile-calendar-container ${isDarkMode ? 'dark' : ''}`}>
      <ProfileCard profile={auth} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      <CalendarContainer schedule={schedule} auth={auth} />
    </div>
  );
};

export default ProfileCalendar;
