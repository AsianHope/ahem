(function(){

    var app = angular.module('employeelist', ['xeditable']);

    app.run(function(editableOptions){
            editableOptions.theme='bs3';
    });

    app.directive('staffList', function(){
	return {
		restrict: 'E',
		templateUrl: 'templates/stafflist.html',
	};
    });

    app.directive('newStaff', function(){
	return {
		restrict: 'E',
		templateUrl: 'templates/register.html',
	};
    });

    app.directive('viewStaff', function(){
	return {
		restrict: 'E',
		templateUrl: 'templates/view.html',
	};
    });

   app.directive('editableTest', function(){
	return {
		restrict: 'E',
		templateUrl: 'templates/editable.html',
	};
    });

   app.controller('EditableCtrl', function($scope){
        $scope.user={
                name: 'awesome user'
        };
    });

   app.controller('TabController', function(){
        this.tab=3;
        this.isSet = function(checkTab){
            return this.tab === checkTab;
        };

        this.setTab = function(setTab){
            this.tab = setTab;
        };
    });


   app.controller('EmployeeListController', function($scope, $filter){
        //load test data
        this.employees=staff;
        this.curemployee=null;

        //rough approximation
        this.timeBetween = function(startDate, endDate){
          if (endDate === 'present') endDate=new Date();
          if (!startDate) return ('Please enter a start date');
          var start = new Date(startDate);
          var end = new Date(endDate);
          var diff = (end - start);

          //1000ms/s * 60s/min * 60m/hr * 24 hrs/day
          var day = 1000 * 60 * 60 * 24;

          var years = Math.floor(diff/(365*day));
          if (years>=1) diff -= 365*years*day;

          var months = Math.floor(diff/(31*day));
          if(months>=1) diff-=31*months*day;

          var days= Math.floor(diff/day);

          return 'approximately '+years+' year(s), '+months+' month(s), '+days+' day(s)';
        };
        this.clearEmployee = function(){
            this.curemployee=null;
        };

        this.setEmployee = function(setEmployee){
            this.curemployee=setEmployee;
        };

        this.shift = function(amount){
            for(var i=0; i<this.employees.length; i++){
                if(this.employees[i].employeeNumber === this.curemployee.employeeNumber){
                    this.curemployee = this.employees[i+amount];
                    break;
                }
            }
        };


        $scope.genders = [
            {value: 'M', text: 'M'},
            {value: 'F', text: 'F'}
        ];

        $scope.departments= [
            {value: 'ADMIN-KH', text: 'Admin Cambodia'},
            {value: 'ADMIN-USA', text: 'Admin USA'},
            {value: 'AHIS', text: 'Asian Hope School'},
            {value: 'HELP-ASIA', text: 'HELP Asia'},
            {value: 'HELP-USA', text: 'HELP USA'},
            {value: 'LIS', text: 'Logos'},
            {value: 'MIS', text: 'MIS Department'},
            {value: 'VDP-G', text: 'VDP General'},
            {value: 'VDP-TK', text: 'VDP Toul Kork'},
            {value: 'VDP-PPT', text: 'VDP Phnom Penh Thmey'},
            {value: 'VDP-NKO', text: 'VDP NKO'},
            {value: 'MULTI', text: 'Multiple Departments'},

        ];

        $scope.employeetypes= [
            {value: 'PT', text: 'Part Time'},
            {value: 'FT', text: 'Full Time'},
            {value: 'NLE', text: 'No Longer Employed'},
        ];

        //pull these from a database or API -
        //BUG WARNING: if value doesn't match index in array things will get wonky
        $scope.documentType=[
          {value: '0', text: 'Photo', required_by: 'all'},
          {value: '1', text: 'CV/Resume', required_by: 'all'},
          {value: '2', text: 'Statement of Faith', required_by: 'all'},
          {value: '3', text: 'Letter of Reference', required_by: 'all'},
          {value: '4', text: 'Child Protection Policy', required_by: 'all'},
          {value: '5', text: 'Background Check', required_by: 'all'},
          {value: '6', text: 'Offer Letter', required_by: 'all'},
          {value: '7', text: 'Employee Handbook Receipt', required_by: 'all'},
          {value: '8', text: 'Position Description', required_by: 'all'},
          {value: '9', text: 'Physical Examination Report', required_by: 'all'},
          {value: '10', text: 'Copy of Passport', required_by: 'all'},
          {value: '11', text: 'Copy of Visa', required_by: 'all'},
          {value: '12', text: 'Copy of ID', required_by: 'all'},
          {value: '13', text: 'W4', required_by: 'all'},
          {value: '14', text: 'Code of Ethics', required_by: 'all'},
          {value: '15', text: 'Employee Status Form', required_by: 'all'},
          {value: '16', text: 'Other Supporting Documentation', required_by: ''},


        ];

        $scope.showMissingDocs = function(doclist, required_docs){
          var tempid;
          var reqdocs = required_docs.slice();
          var missingdocs=[];
          if(!doclist) return required_docs;

          //get rid of all docs they have
          for(var i=0; i<doclist.length; i++){
            tempid=doclist[i].document_id;
            delete reqdocs[tempid];
          }

          for(var i=0; i<required_docs.length; i++){
            if(reqdocs[i]) missingdocs.push(reqdocs[i]);
          }

          return missingdocs;
        };


        $scope.maritalstatuses= [
            {value: 'Married', text: 'Married'},
            {value: 'Single', text: 'Single'}
        ];

        $scope.religions= [
            {value: 'Buddhist', text: 'Buddhist'},
            {value: 'Christian', text: 'Christian'},
            {value: 'Undeclared', text: 'Undeclared'},
        ];

        $scope.ahcountries = [
          {value: 'KH', text: 'Cambodia'},
          {value: 'US', text: 'USA'},
        ];

        $scope.countries = [
          {value: 'AF', text: 'Afghanistan'},
          {value: 'AX', text: 'Åland Islands'},
          {value: 'AL', text: 'Albania'},
          {value: 'DZ', text: 'Algeria'},
          {value: 'AS', text: 'American Samoa'},
          {value: 'AD', text: 'Andorra'},
          {value: 'AO', text: 'Angola'},
          {value: 'AI', text: 'Anguilla'},
          {value: 'AG', text: 'Antigua and Barbuda'},
          {value: 'AR', text: 'Argentina'},
          {value: 'AM', text: 'Armenia'},
          {value: 'AW', text: 'Aruba'},
          {value: 'AU', text: 'Australia'},
          {value: 'AT', text: 'Austria'},
          {value: 'AZ', text: 'Azerbaijan'},
          {value: 'BS', text: 'Bahamas'},
          {value: 'BH', text: 'Bahrain'},
          {value: 'BD', text: 'Bangladesh'},
          {value: 'BB', text: 'Barbados'},
          {value: 'BY', text: 'Belarus'},
          {value: 'BE', text: 'Belgium'},
          {value: 'BZ', text: 'Belize'},
          {value: 'BJ', text: 'Benin'},
          {value: 'BM', text: 'Bermuda'},
          {value: 'BT', text: 'Bhutan'},
          {value: 'BO', text: 'Bolivia' },
          {value: 'BQ', text: 'Bonaire'},
          {value: 'BA', text: 'Bosnia and Herzegovina'},
          {value: 'BW', text: 'Botswana'},
          {value: 'BV', text: 'Bouvet Island'},
          {value: 'BR', text: 'Brazil'},
          {value: 'IO', text: 'British Indian Ocean Territory'},
          {value: 'BN', text: 'Brunei Darussalam'},
          {value: 'BG', text: 'Bulgaria'},
          {value: 'BF', text: 'Burkina Faso'},
          {value: 'BI', text: 'Burundi'},
          {value: 'CV', text: 'Cabo Verde'},
          {value: 'KH', text: 'Cambodia'},
          {value: 'CM', text: 'Cameroon'},
          {value: 'CA', text: 'Canada'},
          {value: 'KY', text: 'Cayman Islands'},
          {value: 'CF', text: 'Central African Republic'},
          {value: 'TD', text: 'Chad'},
          {value: 'CL', text: 'Chile'},
          {value: 'CN', text: 'China'},
          {value: 'CX', text: 'Christmas Island'},
          {value: 'CC', text: 'Cocos (Keeling) Islands'},
          {value: 'CO', text: 'Colombia'},
          {value: 'KM', text: 'Comoros'},
          {value: 'CG', text: 'Congo'},
          {value: 'CD', text: 'Congo'},
          {value: 'CK', text: 'Cook Islands'},
          {value: 'CR', text: 'Costa Rica'},
          {value: 'CI', text: 'Côte d\'Ivoire'},
          {value: 'HR', text: 'Croatia'},
          {value: 'CU', text: 'Cuba'},
          {value: 'CW', text: 'Curaçao'},
          {value: 'CY', text: 'Cyprus'},
          {value: 'CZ', text: 'Czech Republic'},
          {value: 'DK', text: 'Denmark'},
          {value: 'DJ', text: 'Djibouti'},
          {value: 'DM', text: 'Dominica'},
          {value: 'DO', text: 'Dominican Republic'},
          {value: 'EC', text: 'Ecuador'},
          {value: 'EG', text: 'Egypt'},
          {value: 'SV', text: 'El Salvador'},
          {value: 'GQ', text: 'Equatorial Guinea'},
          {value: 'ER', text: 'Eritrea'},
          {value: 'EE', text: 'Estonia'},
          {value: 'ET', text: 'Ethiopia'},
          {value: 'FO', text: 'Faroe Islands'},
          {value: 'FJ', text: 'Fiji'},
          {value: 'FI', text: 'Finland'},
          {value: 'FR', text: 'France'},
          {value: 'GF', text: 'French Guiana'},
          {value: 'PF', text: 'French Polynesia'},
          {value: 'GA', text: 'Gabon'},
          {value: 'GM', text: 'Gambia'},
          {value: 'GE', text: 'Georgia'},
          {value: 'DE', text: 'Germany'},
          {value: 'GH', text: 'Ghana'},
          {value: 'GI', text: 'Gibraltar'},
          {value: 'GR', text: 'Greece'},
          {value: 'GL', text: 'Greenland'},
          {value: 'GD', text: 'Grenada'},
          {value: 'GP', text: 'Guadeloupe'},
          {value: 'GU', text: 'Guam'},
          {value: 'GT', text: 'Guatemala'},
          {value: 'GG', text: 'Guernsey'},
          {value: 'GN', text: 'Guinea'},
          {value: 'GW', text: 'Guinea-Bissau'},
          {value: 'GY', text: 'Guyana'},
          {value: 'HT', text: 'Haiti'},
          {value: 'HN', text: 'Honduras'},
          {value: 'HK', text: 'Hong Kong'},
          {value: 'HU', text: 'Hungary'},
          {value: 'IS', text: 'Iceland'},
          {value: 'IN', text: 'India'},
          {value: 'ID', text: 'Indonesia'},
          {value: 'IR', text: 'Iran'},
          {value: 'IQ', text: 'Iraq'},
          {value: 'IE', text: 'Ireland'},
          {value: 'IM', text: 'Isle of Man'},
          {value: 'IL', text: 'Israel'},
          {value: 'IT', text: 'Italy'},
          {value: 'JM', text: 'Jamaica'},
          {value: 'JP', text: 'Japan'},
          {value: 'JE', text: 'Jersey'},
          {value: 'JO', text: 'Jordan'},
          {value: 'KZ', text: 'Kazakhstan'},
          {value: 'KE', text: 'Kenya'},
          {value: 'KI', text: 'Kiribati'},
          {value: 'KP', text: 'North Korea'},
          {value: 'KR', text: 'Korea'},
          {value: 'KW', text: 'Kuwait'},
          {value: 'KG', text: 'Kyrgyzstan'},
          {value: 'LA', text: 'Laos'},
          {value: 'LV', text: 'Latvia'},
          {value: 'LB', text: 'Lebanon'},
          {value: 'LS', text: 'Lesotho'},
          {value: 'LR', text: 'Liberia'},
          {value: 'LY', text: 'Libya'},
          {value: 'LI', text: 'Liechtenstein'},
          {value: 'LT', text: 'Lithuania'},
          {value: 'LU', text: 'Luxembourg'},
          {value: 'MO', text: 'Macao'},
          {value: 'MK', text: 'Macedonia'},
          {value: 'MG', text: 'Madagascar'},
          {value: 'MW', text: 'Malawi'},
          {value: 'MY', text: 'Malaysia'},
          {value: 'MV', text: 'Maldives'},
          {value: 'ML', text: 'Mali'},
          {value: 'MT', text: 'Malta'},
          {value: 'MH', text: 'Marshall Islands'},
          {value: 'MQ', text: 'Martinique'},
          {value: 'MR', text: 'Mauritania'},
          {value: 'MU', text: 'Mauritius'},
          {value: 'YT', text: 'Mayotte'},
          {value: 'MX', text: 'Mexico'},
          {value: 'FM', text: 'Micronesia'},
          {value: 'MD', text: 'Moldova'},
          {value: 'MC', text: 'Monaco'},
          {value: 'MN', text: 'Mongolia'},
          {value: 'ME', text: 'Montenegro'},
          {value: 'MS', text: 'Montserrat'},
          {value: 'MA', text: 'Morocco'},
          {value: 'MZ', text: 'Mozambique'},
          {value: 'MM', text: 'Myanmar'},
          {value: 'NA', text: 'Namibia'},
          {value: 'NR', text: 'Nauru'},
          {value: 'NP', text: 'Nepal'},
          {value: 'NL', text: 'Netherlands'},
          {value: 'NC', text: 'New Caledonia'},
          {value: 'NZ', text: 'New Zealand'},
          {value: 'NI', text: 'Nicaragua'},
          {value: 'NE', text: 'Niger'},
          {value: 'NG', text: 'Nigeria'},
          {value: 'NU', text: 'Niue'},
          {value: 'NO', text: 'Norway'},
          {value: 'OM', text: 'Oman'},
          {value: 'PK', text: 'Pakistan'},
          {value: 'PW', text: 'Palau'},
          {value: 'PS', text: 'Palestine'},
          {value: 'PA', text: 'Panama'},
          {value: 'PG', text: 'Papua New Guinea'},
          {value: 'PY', text: 'Paraguay'},
          {value: 'PE', text: 'Peru'},
          {value: 'PH', text: 'Philippines'},
          {value: 'PN', text: 'Pitcairn'},
          {value: 'PL', text: 'Poland'},
          {value: 'PT', text: 'Portugal'},
          {value: 'PR', text: 'Puerto Rico'},
          {value: 'QA', text: 'Qatar'},
          {value: 'RE', text: 'Réunion'},
          {value: 'RO', text: 'Romania'},
          {value: 'RU', text: 'Russian Federation'},
          {value: 'RW', text: 'Rwanda'},
          {value: 'BL', text: 'Saint Barthélemy'},
          {value: 'SH', text: 'Saint Helena'},
          {value: 'WS', text: 'Samoa'},
          {value: 'SM', text: 'San Marino'},
          {value: 'ST', text: 'Sao Tome and Principe'},
          {value: 'SA', text: 'Saudi Arabia'},
          {value: 'SN', text: 'Senegal'},
          {value: 'RS', text: 'Serbia'},
          {value: 'SC', text: 'Seychelles'},
          {value: 'SL', text: 'Sierra Leone'},
          {value: 'SG', text: 'Singapore'},
          {value: 'SK', text: 'Slovakia'},
          {value: 'SI', text: 'Slovenia'},
          {value: 'SB', text: 'Solomon Islands'},
          {value: 'SO', text: 'Somalia'},
          {value: 'ZA', text: 'South Africa'},
          {value: 'SS', text: 'South Sudan'},
          {value: 'ES', text: 'Spain'},
          {value: 'LK', text: 'Sri Lanka'},
          {value: 'SD', text: 'Sudan'},
          {value: 'SR', text: 'Suriname'},
          {value: 'SZ', text: 'Swaziland'},
          {value: 'SE', text: 'Sweden'},
          {value: 'CH', text: 'Switzerland'},
          {value: 'TW', text: 'Taiwan'},
          {value: 'TJ', text: 'Tajikistan'},
          {value: 'TZ', text: 'Tanzania'},
          {value: 'TH', text: 'Thailand'},
          {value: 'TL', text: 'Timor-Leste'},
          {value: 'TG', text: 'Togo'},
          {value: 'TK', text: 'Tokelau'},
          {value: 'TO', text: 'Tonga'},
          {value: 'TT', text: 'Trinidad and Tobago'},
          {value: 'TN', text: 'Tunisia'},
          {value: 'TR', text: 'Turkey'},
          {value: 'TM', text: 'Turkmenistan'},
          {value: 'TV', text: 'Tuvalu'},
          {value: 'UG', text: 'Uganda'},
          {value: 'UA', text: 'Ukraine'},
          {value: 'AE', text: 'United Arab Emirates'},
          {value: 'GB', text: 'United Kingdom'},
          {value: 'US', text: 'United States'},
          {value: 'UY', text: 'Uruguay'},
          {value: 'UZ', text: 'Uzbekistan'},
          {value: 'VU', text: 'Vanuatu'},
          {value: 'VE', text: 'Venezuela'},
          {value: 'VN', text: 'Viet Nam'},
          {value: 'EH', text: 'Western Sahara'},
          {value: 'YE', text: 'Yemen'},
          {value: 'ZM', text: 'Zambia'},
          {value: 'ZW', text: 'Zimbabwe'},
        ];
    });

















    var staff= [
        {
   cn: 'agordon',
   displayName: 'agordon',
   givenName: 'Andrew',
   sn: 'Gordon',
   mail: 'agordon@asianhope.org',
   personalmail: 'andyg@gmail.com',
   departmentNumber: 'AHIS',
   title: 'Special Educational Needs',
   uidNumber: '1000061',
   employeeNumber: '1000061',
   homeDirectory: '/home/agordon',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1063',
   gidNumber: '1000001',
   employeeType: 'FT',
   c: 'UK',
   l: 'KH',
   mobile: '+85517933460',
   postalAddress: '#14A Maple \n Sunway City\n Phnom Penh',
   appleBirthday: '10-Oct-1981',
   faith: 'Christian',
   idnumber: '1512415230',
   maritalstatus: 'Single',
   children: '0',
   insurance: 'Talent Trust',
   enteredCambodia: '1-Aug-2011',
   employmentStart: '2013-10-31',
   employmentEnd: '2014-10-31',
   gender: 'M',
   givenNamekh: '',
   snkh:'',
   degree: 'PHD',
   degreeArea: 'Educational Psychology',
   nssf:'12345',
   visaExpires: '2014-05-01',
   notes: 'These are notes.\n\non Multiple lines\n\nOh he gets lots of airfare.',
   employee_documentation: [
    {document_id:'0', url:'files/1000061/agordon_photo.jpg', description:''},
    {document_id:'1', url:'files/1000061/agordon_cv.jpg', description:''},
    {document_id:'2', url:'files/1000061/agordon_sof.jpg', description:''},
    {document_id:'3', url:'files/1000061/agordon_reference.jpg', description:''},
    {document_id:'4', url:'files/1000061/agordon_cpp.jpg', description:''},
    {document_id:'16', url:'files/1000061/agordon_misc_termination.jpg', description:'Employee Termination Form'},
    {document_id:'16', url:'files/1000061/agordon_15.jpg', description:'Miscellaneous Employee Award'},
    {document_id:'16', url:'files/1000061/agordon_16.jpg', description:'Salary Increase'},


   ],


},

{
   cn: 'cban',
   displayName: 'cban',
   givenName: 'Chenda',
   sn: 'Ban',
   mail: 'cban@asianhope.org',
   departmentNumber: 'VDP',
   title: 'Staff',
   uidNumber: '1000062',
   employeeNumber: '1000062',
   homeDirectory: '/home/cban',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1064',
   gidNumber: '1000001',
   employeeType: 'PT',
   gender: 'F',
   employmentStart: '2013-10-31',
},

{
   cn: 'kyean',
   displayName: 'kyean',
   givenName: 'wadhana',
   sn: 'Yeanky',
   mail: 'kyean@asianhope.org',
   departmentNumber: 'LIS',
   title: 'Staff',
   uidNumber: '1000064',
   employeeNumber: '1000064',
   homeDirectory: '/home/kyean',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1066',
   gidNumber: '1000001',
   employeeType: 'PT',
},

{
   cn: 'ksong',
   displayName: 'ksong',
   givenName: 'Kathy',
   sn: 'Song',
   mail: 'ksong@asianhope.org',
   departmentNumber: 'LIS',
   title: 'Staff',
   uidNumber: '1000065',
   employeeNumber: '1000065',
   homeDirectory: '/home/ksong',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1067',
   gidNumber: '1000001',
   employeeType: 'PT',
},

{
   cn: 'pworkman',
   displayName: 'pworkman',
   givenName: 'Philip',
   sn: 'Workman',
   mail: 'pworkman@asianhope.org',
   departmentNumber: 'LIS',
   title: 'Staff',
   uidNumber: '1000066',
   employeeNumber: '1000066',
   homeDirectory: '/home/pworkman',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1068',
   gidNumber: '1000001',
   employeeType: 'S',
},

{
   cn: 'mbelloni',
   displayName: 'mbelloni',
   givenName: 'Mike',
   sn: 'Belloni',
   mail: 'mbelloni@asianhope.org',
   departmentNumber: 'LIS',
   title: 'Training Specialist',
   uidNumber: '1000067',
   employeeNumber: '1000067',
   homeDirectory: '/home/mbelloni',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1069',
   gidNumber: '1000001',
   employeeType: 'S',
},

{
   cn: 'llim',
   displayName: 'llim',
   givenName: 'Lordelle',
   sn: 'Lim',
   mail: 'llim@asianhope.org',
   departmentNumber: 'LIS',
   title: 'Staff',
   uidNumber: '1000068',
   employeeNumber: '1000068',
   homeDirectory: '/home/llim',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1070',
   gidNumber: '1000001',
   employeeType: 'S',
},

{
   cn: 'amacmillan',
   displayName: 'amacmillan',
   givenName: 'Alyssa',
   sn: 'MacMillan',
   mail: 'amacmillan@asianhope.org',
   departmentNumber: 'LIS',
   title: 'Staff',
   uidNumber: '1000069',
   employeeNumber: '1000069',
   homeDirectory: '/home/amacmillan',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1071',
   gidNumber: '1000001',
   employeeType: 'S',
},

{
   cn: 'run',
   displayName: 'run',
   givenName: 'Rachel',
   sn: 'Un',
   mail: 'run@asianhope.org',
   departmentNumber: 'LIS',
   title: 'Teacher',
   uidNumber: '1000070',
   employeeNumber: '1000070',
   homeDirectory: '/home/run',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1072',
   gidNumber: '1000001',
   employeeType: 'S',
},

{
   cn: 'ccooper',
   displayName: 'ccooper',
   givenName: 'Chelsea',
   sn: 'Cooper',
   mail: 'ccooper@asianhope.org',
   departmentNumber: 'LIS',
   title: 'Staff',
   uidNumber: '1000071',
   employeeNumber: '1000071',
   homeDirectory: '/home/ccooper',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1073',
   gidNumber: '1000001',
   employeeType: 'S',
},

{
   cn: 'vkeo',
   displayName: 'vkeo',
   givenName: 'Vuthy',
   sn: 'Keo',
   mail: 'vkeo@asianhope.org',
   departmentNumber: 'LIS',
   title: 'Staff',
   uidNumber: '1000073',
   employeeNumber: '1000073',
   homeDirectory: '/home/vkeo',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1075',
   gidNumber: '1000001',
   employeeType: 'S',
},

{
   cn: 'socheata.mao',
   displayName: 'socheata.mao',
   givenName: 'Socheata',
   sn: 'Mao',
   mail: 'socheata.mao@asianhope.org',
   departmentNumber: 'LIS',
   title: 'Office Coordinator',
   uidNumber: '1000074',
   employeeNumber: '1000074',
   homeDirectory: '/home/socheata.mao',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1076',
   gidNumber: '1000001',
   employeeType: 'S',
},

{
   cn: 'mstolk',
   displayName: 'mstolk',
   givenName: 'Meagan',
   sn: 'Stolk',
   mail: 'mstolk@asianhope.org',
   departmentNumber: 'LIS',
   title: 'Staff',
   uidNumber: '1000075',
   employeeNumber: '1000075',
   homeDirectory: '/home/mstolk',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1077',
   gidNumber: '1000001',
   employeeType: 'S',
},

{
   cn: 'sschleper',
   displayName: 'sschleper',
   givenName: 'Scott',
   sn: 'Schleper',
   mail: 'sschleper@asianhope.org',
   departmentNumber: 'LIS',
   title: 'Teacher',
   uidNumber: '1000076',
   employeeNumber: '1000076',
   homeDirectory: '/home/sschleper',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1078',
   gidNumber: '1000001',
   employeeType: 'S',
},

{
   cn: 'ctep',
   displayName: 'ctep',
   givenName: 'Chin',
   sn: 'Tep',
   mail: 'ctep@asianhope.org',
   departmentNumber: 'LIS',
   title: 'Staff',
   uidNumber: '1000077',
   employeeNumber: '1000077',
   homeDirectory: '/home/ctep',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1079',
   gidNumber: '1000001',
   employeeType: 'S',
},

{
   cn: 'kevanson',
   displayName: 'kevanson',
   givenName: 'Kira',
   sn: 'Evanson',
   mail: 'kevanson@asianhope.org',
   departmentNumber: 'LIS',
   title: 'English Teacher',
   uidNumber: '1000079',
   employeeNumber: '1000079',
   homeDirectory: '/home/kevanson',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1081',
   gidNumber: '1000001',
   employeeType: 'S',
},

{
   cn: 'hsnyder',
   displayName: 'hsnyder',
   givenName: 'Hillary',
   sn: 'Snyder',
   mail: 'hsnyder@asianhope.org',
   departmentNumber: 'LIS',
   title: 'Staff',
   uidNumber: '1000080',
   employeeNumber: '1000080',
   homeDirectory: '/home/hsnyder',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1082',
   gidNumber: '1000001',
   employeeType: 'S',
},

{
   cn: 'beab',
   displayName: 'beab',
   givenName: 'Bonika',
   sn: 'Eab',
   mail: 'beab@asianhope.org',
   departmentNumber: 'LIS',
   title: 'Teaching Assistant',
   uidNumber: '1000081',
   employeeNumber: '1000081',
   homeDirectory: '/home/beab',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1083',
   gidNumber: '1000001',
   employeeType: 'S',
},

{
   cn: 'snhek',
   displayName: 'snhek',
   givenName: 'Sovannara',
   sn: 'Nhek',
   mail: 'snhek@asianhope.org',
   departmentNumber: 'LIS',
   title: 'Facilities Manager',
   uidNumber: '1000082',
   employeeNumber: '1000082',
   homeDirectory: '/home/snhek',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1084',
   gidNumber: '1000001',
   employeeType: 'S',
},

{
   cn: 'hschleper',
   displayName: 'hschleper',
   givenName: 'Helen',
   sn: 'Schleper',
   mail: 'hschleper@asianhope.org',
   departmentNumber: 'LIS',
   title: 'Staff',
   uidNumber: '1000083',
   employeeNumber: '1000083',
   homeDirectory: '/home/hschleper',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1085',
   gidNumber: '1000001',
   employeeType: 'S',
},

{
   cn: 'schhoeurn',
   displayName: 'schhoeurn',
   givenName: 'Sreytouch',
   sn: 'Chhoeurn',
   mail: 'schhoeurn@asianhope.org',
   departmentNumber: 'LIS',
   title: 'Receptionist',
   uidNumber: '1000084',
   employeeNumber: '1000084',
   homeDirectory: '/home/schhoeurn',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1086',
   gidNumber: '1000001',
   employeeType: 'S',
},

{
   cn: 'rmorn',
   displayName: 'rmorn',
   givenName: 'Rotha',
   sn: 'Morn',
   mail: 'rmorn@asianhope.org',
   departmentNumber: 'LIS',
   title: 'Staff',
   uidNumber: '1000085',
   employeeNumber: '1000085',
   homeDirectory: '/home/rmorn',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1087',
   gidNumber: '1000001',
   employeeType: 'S',
},

{
   cn: 'tsok',
   displayName: 'tsok',
   givenName: 'Touch',
   sn: 'Sok',
   mail: 'tsok@asianhope.org',
   departmentNumber: 'LIS',
   title: 'Khmer teacher',
   uidNumber: '1000086',
   employeeNumber: '1000086',
   homeDirectory: '/home/tsok',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1088',
   gidNumber: '1000001',
   employeeType: 'S',
},

{
   cn: 'dpatridge',
   displayName: 'dpatridge',
   givenName: 'Danielle',
   sn: 'Patridge',
   mail: 'dpatridge@asianhope.org',
   departmentNumber: 'LIS',
   title: 'Staff',
   uidNumber: '1000088',
   employeeNumber: '1000088',
   homeDirectory: '/home/dpatridge',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1090',
   gidNumber: '1000001',
   employeeType: 'S',
},

{
   cn: 'ekimsrun',
   displayName: 'ekimsrun',
   givenName: 'Elina',
   sn: 'Kimsrun',
   mail: 'ekimsrun@asianhope.org',
   departmentNumber: 'LIS',
   title: 'Director of Finance &amp; Admin',
   uidNumber: '1000089',
   employeeNumber: '1000089',
   homeDirectory: '/home/ekimsrun',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1091',
   gidNumber: '1000001',
   employeeType: 'S',
},

{
   cn: 'ckhoun',
   displayName: 'ckhoun',
   givenName: 'Chanreth',
   sn: 'Khoun',
   mail: 'ckhoun@asianhope.org',
   departmentNumber: 'LIS',
   title: 'Teaching Assistant',
   uidNumber: '1000090',
   employeeNumber: '1000090',
   homeDirectory: '/home/ckhoun',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1092',
   gidNumber: '1000001',
   employeeType: 'S',
},

{
   cn: 'sten',
   displayName: 'sten',
   givenName: 'Syna',
   sn: 'Ten',
   mail: 'sten@asianhope.org',
   departmentNumber: 'LIS',
   title: 'Staff',
   uidNumber: '1000091',
   employeeNumber: '1000091',
   homeDirectory: '/home/sten',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1093',
   gidNumber: '1000001',
   employeeType: 'S',
},

{
   cn: 'mkozloff',
   displayName: 'mkozloff',
   givenName: 'Mindy',
   sn: 'Kozloff',
   mail: 'mkozloff@asianhope.org',
   departmentNumber: 'LIS',
   title: 'Staff',
   uidNumber: '1000092',
   employeeNumber: '1000092',
   homeDirectory: '/home/mkozloff',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1094',
   gidNumber: '1000001',
   employeeType: 'S',
},

{
   cn: 'hansen',
   displayName: 'hansen',
   givenName: 'Joe-Rene',
   sn: 'Hansen',
   mail: 'hansen@asianhope.org',
   departmentNumber: 'LIS',
   title: 'Staff',
   uidNumber: '1000093',
   employeeNumber: '1000093',
   homeDirectory: '/home/hansen',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1095',
   gidNumber: '1000001',
   employeeType: 'S',
},

{
   cn: 'lcottle',
   displayName: 'lcottle',
   givenName: 'Lynette',
   sn: 'Cottle',
   mail: 'lcottle@asianhope.org',
   departmentNumber: 'LIS',
   title: 'Khmer Teacher Training Program Coodinator',
   uidNumber: '1000094',
   employeeNumber: '1000094',
   homeDirectory: '/home/lcottle',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1096',
   gidNumber: '1000001',
   employeeType: 'S',
},

{
   cn: 'pchhorn',
   displayName: 'pchhorn',
   givenName: 'Pheary',
   sn: 'Chhorn',
   mail: 'pchhorn@asianhope.org',
   departmentNumber: 'LIS',
   title: 'Staff',
   uidNumber: '1000095',
   employeeNumber: '1000095',
   homeDirectory: '/home/pchhorn',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1097',
   gidNumber: '1000001',
   employeeType: 'S',
},

{
   cn: 'cswain',
   displayName: 'cswain',
   givenName: 'Caitlin',
   sn: 'Swain',
   mail: 'cswain@asianhope.org',
   departmentNumber: 'LIS',
   title: 'Teacher',
   uidNumber: '1000097',
   employeeNumber: '1000097',
   homeDirectory: '/home/cswain',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1099',
   gidNumber: '1000001',
   employeeType: 'S',
},

{
   cn: 'dchheuy',
   displayName: 'dchheuy',
   givenName: 'Dina',
   sn: 'Chheuy',
   mail: 'dchheuy@asianhope.org',
   departmentNumber: 'LIS',
   title: 'Staff',
   uidNumber: '1000099',
   employeeNumber: '1000099',
   homeDirectory: '/home/dchheuy',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1101',
   gidNumber: '1000001',
   employeeType: 'S',
},

{
   cn: 'aglas',
   displayName: 'aglas',
   givenName: 'Alta',
   sn: 'Glas',
   mail: 'aglas@asianhope.org',
   departmentNumber: 'LIS',
   title: 'Staff',
   uidNumber: '1000100',
   employeeNumber: '1000100',
   homeDirectory: '/home/aglas',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1102',
   gidNumber: '1000001',
   employeeType: 'S',
},

{
   cn: 'ksrey',
   displayName: 'ksrey',
   givenName: 'Kosal',
   sn: 'Srey',
   mail: 'ksrey@asianhope.org',
   departmentNumber: 'LIS',
   title: 'Staff',
   uidNumber: '1000101',
   employeeNumber: '1000101',
   homeDirectory: '/home/ksrey',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1103',
   gidNumber: '1000001',
   employeeType: 'S',
},

{
   cn: 'lheap',
   displayName: 'lheap',
   givenName: 'Ly',
   sn: 'Heap',
   mail: 'lheap@asianhope.org',
   departmentNumber: 'LIS',
   title: 'IT Assistant',
   uidNumber: '1000102',
   employeeNumber: '1000102',
   homeDirectory: '/home/lheap',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1104',
   gidNumber: '1000001',
   employeeType: 'S',
},

{
   cn: 'nsweet',
   displayName: 'nsweet',
   givenName: 'Nicole',
   sn: 'Sweet',
   mail: 'nsweet@asianhope.org',
   departmentNumber: 'LIS',
   title: 'Staff',
   uidNumber: '1000103',
   employeeNumber: '1000103',
   homeDirectory: '/home/nsweet',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1105',
   gidNumber: '1000001',
   employeeType: 'S',
},

{
   cn: 'tsam',
   displayName: 'tsam',
   givenName: 'Thavy',
   sn: 'Sam',
   mail: 'tsam@asianhope.org',
   departmentNumber: 'LIS',
   title: 'Staff',
   uidNumber: '1000104',
   employeeNumber: '1000104',
   homeDirectory: '/home/tsam',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1106',
   gidNumber: '1000001',
   employeeType: 'S',
},

{
   cn: 'rlong',
   displayName: 'rlong',
   givenName: 'Reasey',
   sn: 'Long',
   mail: 'rlong@asianhope.org',
   departmentNumber: 'LIS',
   title: 'Staff',
   uidNumber: '1000105',
   employeeNumber: '1000105',
   homeDirectory: '/home/rlong',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1107',
   gidNumber: '1000001',
   employeeType: 'S',
},

{
   cn: 'skhorn',
   displayName: 'skhorn',
   givenName: 'Sreyleak',
   sn: 'Khorn',
   mail: 'skhorn@asianhope.org',
   departmentNumber: 'LIS',
   title: 'Staff',
   uidNumber: '1000107',
   employeeNumber: '1000107',
   homeDirectory: '/home/skhorn',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1109',
   gidNumber: '1000001',
   employeeType: 'S',
},

{
   cn: 'gbarnes',
   displayName: 'gbarnes',
   givenName: 'Gordon',
   sn: 'Barnes',
   mail: 'gbarnes@asianhope.org',
   departmentNumber: 'LIS',
   title: 'Teacher',
   uidNumber: '1000108',
   employeeNumber: '1000108',
   homeDirectory: '/home/gbarnes',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1110',
   gidNumber: '1000001',
   employeeType: 'S',
},

{
   cn: 'dchhay',
   displayName: 'dchhay',
   givenName: 'Sodalis',
   sn: 'Chhay',
   mail: 'dchhay@asianhope.org',
   departmentNumber: 'LIS',
   title: 'Office Coordinator Assistant',
   uidNumber: '1000109',
   employeeNumber: '1000109',
   homeDirectory: '/home/dchhay',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1111',
   gidNumber: '1000001',
   employeeType: 'S',
},

{
   cn: 'kindercare',
   displayName: 'kindercare',
   givenName: 'Kinder',
   sn: 'Care',
   mail: 'kindercare@asianhope.org',
   departmentNumber: 'LIS',
   title: 'Staff',
   uidNumber: '1000110',
   employeeNumber: '1000110',
   homeDirectory: '/home/kindercare',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1112',
   gidNumber: '1000001',
   employeeType: 'S',
},

{
   cn: 'tom',
   displayName: 'tom',
   givenName: 'Tom',
   sn: 'Matuschka',
   mail: 'tom@asianhope.org',
   departmentNumber: 'LIS',
   title: 'President &amp; CEO',
   uidNumber: '1000112',
   employeeNumber: '1000112',
   homeDirectory: '/home/tom',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1114',
   gidNumber: '1000001',
   employeeType: 'S',
},

{
   cn: 'eseng',
   displayName: 'eseng',
   givenName: 'Ehud',
   sn: 'Seng',
   mail: 'eseng@asianhope.org',
   departmentNumber: 'LIS',
   title: 'Staff',
   uidNumber: '1000113',
   employeeNumber: '1000113',
   homeDirectory: '/home/eseng',
   sambaSID: 'S-1-5-21-3527002495-2526512175-3850050249-1115',
   gidNumber: '1000001',
   employeeType: 'S',
},

    ]

})();
