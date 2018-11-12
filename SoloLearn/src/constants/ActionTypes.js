// Learn types
export const LOAD_COURSES = 'LOAD_COURSES';
export const LOAD_LEVELS = 'LOAD_LEVELS';
export const LOAD_COURSE = 'LOAD_COURSE';
export const TOGGLE_COURSE = 'TOGGLE_COURSE';
export const MAP_MODULES = 'MAP_MODULES';
export const MAP_LESSONS = 'MAP_LESSONS';
export const MAP_QUIZZES = 'MAP_QUIZZES';
export const MODULE_SELECTED = 'MODULE_SELECTED';
export const LESSON_SELECTED = 'LESSON_SELECTED';
export const QUIZ_SELECTED = 'QUIZ_SELECTED ';
export const SET_SHORTCUT_LESSON = 'SET_SHORTCUT_LESSON';

// Playground types
export const SET_CODES = 'SET_CODES';
export const EMPTY_CODES = 'EMPTY_CODES';
export const REMOVE_CODE = 'REMOVE_CODE';
export const SET_CODES_FILTERS = 'SET_CODES_FILTERS';
export const MARK_CODES_LIST_FINISHED = 'MARK_CODES_LIST_FINISHED';
export const REQUEST_CODES = 'REQUEST_CODES';
export const SET_SIDEBAR_CODES = 'SET_SIDEBAR_CODES';

// Discuss types
export const SET_POSTS = 'SET_POSTS';
export const EMPTY_POSTS = 'EMPTY_POSTS';
export const REMOVE_POST = 'REMOVE_POST';
export const SET_DISCUSS_FILTERS = 'SET_DISCUSS_FILTERS';
export const MARK_DISCUSS_LIST_FINISHED = 'MARK_DISCUSS_LIST_FINISHED';
export const REQUEST_POSTS = 'REQUEST_POSTS';
export const SET_SIDEBAR_QUESTIONS = 'SET_SIDEBAR_QUESTIONS';
export const CHANGE_POST_REPLIES_COUNT = 'CHANGE_POST_REPLIES_COUNT';

export const LOAD_DISCUSS_POST = 'LOAD_DISCUSS_POST';
export const LOAD_DISCUSS_POST_REPLIES = 'LOAD_DISCUSS_POST_REPLIES';
export const EMPTY_DISCUSS_POST_REPLIES = 'EMPTY_DISCUSS_POST_REPLIES';
export const VOTE_POST = 'VOTE_POST';
export const EDIT_POST = 'EDIT_POST';
export const DELETE_POST = 'DELETE_POST';
export const QUESTION_FOLLOWING = 'QUESTION_FOLLOWING';
export const ACCEPT_ANSWER = 'ACCEPT_ANSWER';
export const LOAD_DISCUSS_POST_PREVIOUS_REPLIES = 'LOAD_DISCUSS_POST_PREVIOUS_REPLIES';
export const ADD_NEW_REPLY = 'ADD_NEW_REPLY';

// Notification types
export const SET_NOTIFICATIONS = 'SET_NOTIFICATIONS';
export const MARK_NOTIFICATIONS_LIST_FINISHED = 'MARK_NOTIFICATIONS_LIST_FINISHED';
export const SET_NOTIFICATION_COUNT = 'SET_NOTIFICATION_COUNT';
export const MARK_ALL_READ = 'MARK_ALL_READ';
export const MARK_READ = 'MARK_READ';
export const EMPTY_NOTIFICATIONS = 'EMPTY_NOTIFICATIONS';
export const REQUEST_NOTIFICATIONS = 'REQUEST_NOTIFICATIONS';
export const REFRESH_NOTIFICATIONS = 'REFRESH_NOTIFICATIONS';

// Feed types
export const MARK_FEED_FINISHED = 'MARK_FEED_FINISHED';
export const GET_FEED_ITEMS = 'GET_FEED_ITEMS';
export const GET_FEED_PINS = 'GET_FEED_PINS';
export const GET_NEW_FEED_ITEMS = 'GET_NEW_FEED_ITEMS';
export const CLEAR_FEED = 'CLEAR_FEED';
export const SET_FEED_ITEM_VOTE_DATA = 'SET_FEED_ITEM_VOTE_DATA';
export const FOLLOW_USER_SUGGESTION = 'FOLLOW_USER_SUGGESTION';

// Profile
export const GET_USER_PROFILE = 'GET_USER_PROFILE';
export const GET_PROFILE = 'GET_PROFILE';
export const GET_PROFILE_FEED_ITEMS = 'GET_PROFILE_FEED_ITEMS';
export const GET_PROFILE_NEW_FEED_ITEMS = 'GET_PROFILE_NEW_FEED_ITEMS';
export const GET_PROFILE_CODES = 'GET_PROFILE_CODES';
export const GET_PROFILE_QUESTIONS = 'GET_PROFILE_QUESTIONS';
export const EMPTY_PROFILE = 'EMPTY_PROFILE';
export const GET_PROFILE_FOLLOWERS = 'GET_PROFILE_FOLLOWERS';
export const GET_PROFILE_FOLLOWING = 'GET_PROFILE_FOLLOWING';
export const FOLLOW_USER = 'FOLLOW_USER';
export const EMPTY_PROFILE_FOLLOWERS = 'EMPTY_PROFILE_FOLLOWERS';
export const CLEAR_PROFILE_FEED_ITEMS = 'CLEAR_PROFILE_FEED_ITEMS';
export const SET_PROFILE_HAS_MORE_QUESTIONS = 'SET_PROFILE_HAS_MORE_QUESTIONS';

// Challenges
export const SET_CONTESTS = 'SET_CONTESTS';
export const CLEAR_CONTESTS = 'CLEAR_CONTESTS';
export const CHOOSE_CHALLENGE_COURSE = 'CHOOSE_CHALLENGE_COURSE';
export const GET_ALL_PLAYERS = 'GET_ALL_PLAYERS';
export const EMPTY_ALL_PLAYERS = 'EMPTY_ALL_PLAYERS';
export const GET_CONTEST_FOLLOWERS = 'GET_CONTEST_FOLLOWERS';
export const GET_CONTEST_FOLLOWING = 'GET_CONTEST_FOLLOWING';
export const SET_CONTEST = 'SET_CONTEST';

// Discuss query
export const CHANGE_DISCUSS_QUERY = 'CHANGE_DISCUSS_QUERY';
export const CHANGE_DISCUSS_ORDERING = 'CHANGE_DISCUSS_ORDERING';
export const CHANGE_DISCUSS_HAS_MORE = 'CHANGE_DISCUSS_HAS_MORE';

// Slay
export const SET_CURRENT_LESSON_COLLECTION = 'SET_CURRENT_LESSON_COLLECTION';
export const SET_LESSON_COLLECTIONS = 'SET_LESSON_COLLECTIONS';
export const SET_COLLECTION_ITEMS = 'SET_COLLECTION_ITEMS';
export const SET_ACTIVE_LESSON = 'SET_ACTIVE_LESSON';
export const SET_LESSONS_BY_USER = 'SET_LESSONS_BY_USER';
export const APPEND_COLLECTION_ITEMS = 'APPEND_COLLECTION_ITEMS';
export const APPEND_LESSONS_BY_USER = 'APPEND_LESSONS_BY_USER';
export const SET_BOOKMARK_COLLECTION_ITEMS = 'SET_BOOKMARK_COLLECTION_ITEMS';
export const APPEND_BOOKMARK_COLLECTION_ITEMS = 'APPEND_BOOKMARK_COLLECTION_ITEMS';
export const ADD_BOOKMARK_ITEM = 'ADD_BOOKMARK_ITEM';
export const REMOVE_BOOKMARK_ITEM = 'REMOVE_BOOKMARK_ITEM';

// Settings
export const SET_SETTINGS = 'SET_SETTINGS';
export const UPDATE_SETTING = 'UPDATE_SETTING';
export const SET_PROFILE_DATA = 'SET_PROFILE_DATA';
export const UPDATE_PROFILE_DATA = 'UPDATE_PROFILE_DATA';
export const SET_BLOCKED_USERS = 'SET_BLOCKED_USERS';
export const UPDATE_BLOCKED_USERS = 'UPDATE_BLOCKED_USERS';
export const SET_WEAPON_SETTINGS = 'SET_WEAPON_SETTINGS';
export const UPDATE_WEAPON_SETTING = 'UPDATE_WEAPON_SETTING';

// Leaderboards
export const SET_LEADERBOARD = 'SET_LEADERBOARD';
export const APPEND_LEADERBOARD_USERS = 'APPEND_LEADERBOARD_USERS';

// Discover
export const SET_DISCOVER_SUGGESTIONS = 'SET_DISCOVER_SUGGESTIONS';
export const REMOVE_SEARCH_SUGGESTIONS = 'REMOVE_SEARCH_SUGGESTIONS';
export const SET_SEARCH_SUGGESTIONS = 'SET_SEARCH_SUGGESTIONS';

// Quiz Factory
export const SET_SUGGESTION_CHALLENGE = 'SET_SUGGESTION_CHALLENGE';

// General
export const RESET_LOCALE_DATA = 'RESET_LOCALE_DATA';
export const LOGOUT = 'LOGOUT';

// Search
export const SET_SEARCH_SECTION = 'SET_SEARCH_SECTION';
export const SET_SEARCH_VALUE = 'SET_SEARCH_VALUE';
export const TOGGLE_SEARCH_BAR = 'TOGGLE_SEARCH_BAR';
