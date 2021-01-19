﻿(function () {
    'use strict';

    angular
        .module('app')
        .constant('appConfig', {
            api_end_point: 'https://localhost:44396',
            file_end_point: 'https://localhost:44396',
            application_id: '41263a36-b527-4fbd-905d-0098653937a7',
            password_key: '461a509f-596d-4093-8094-e2db8af514d3',
            errors: {
            },
            no_image: '/assets/images/aidil.jpg'
        })
        .constant('Message', {
            Msg1: 'Mandatory field.'
        });

})();
