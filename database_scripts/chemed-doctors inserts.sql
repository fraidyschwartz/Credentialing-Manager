use `credentialing_manager`;

insert into departments values (null, 'Behavior Health'), (null, 'Dental'), (null, 'Internal Medicine'), (null, 'Pediatrics'), (null, 'Specialty'), (null, 'Women''s health');
select * from departments;

insert into facilities values (null, 'Behavior Health'), (null, 'Dental'), (null, 'Medical');
select * from facilities;

insert into application_statuses values (null, 'N/A'), (null, 'Waiting for provider to give us info'), (null, 'We are filling out application'), 
										(null, 'Waiting for provider signature'), (null, 'Submitted application'), 
                                        (null, 'Yes- it is effective'), (null, 'No');
select * from application_statuses;
