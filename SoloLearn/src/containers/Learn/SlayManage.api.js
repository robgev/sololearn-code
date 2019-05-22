import Service from 'api/service';

export const resetProgress = async courseId => Service.request('ResetProgress', { courseId });
