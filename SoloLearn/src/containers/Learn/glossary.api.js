import Service from 'api/service';

export const getCourse = id => Service.request('GetCourse', { id });
