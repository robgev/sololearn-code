import Service from 'api/service';

export const resetProgress = courseId => Service.request('ResetProgress', { courseId });
