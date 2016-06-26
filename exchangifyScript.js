
	//To upload the image and show it in the preview div
	// $('#file').change(function(){
	// 	var reader = new FileReader();

	// 	reader.onload = function(image){
	// 		$('.imageUploadedOrNot').show(0);
	// 		$('#blankImg').attr('src', image.target.result);
	// 	}

	// 	reader.readAsDataURL(this.files[0]);
	// });

	// //To hide the image previously loaded
	// $('#launchDlgBtn').click(function(){
	// 	$('.imageUploadedOrNot').hide();
	// });

/************************************Angular code starts******************************************/
	var app = angular.module('mainApp',['ngRoute']);

	app.config( function($routeProvider){
		$routeProvider
		.when( '/', {
			templateUrl: '/login.html',
			controller: 'exchangifyController'
		})
		.when( '/dashboard',{
			resolve: {
				"check": function($location, $rootScope	){
					if( !$rootScope.loggedIn ){
						$location.path('/');
					}
				}
			},
			// resolve: {
			// 	"check": function($location, $rootScope	){
			// 		if( !$rootScope.loggedIn ){
			// 			$('#loginPageNavBar').hide();
			// 		}
			// 	}
			// },
			templateUrl: '/dashboard.html'
		})
		.when( '/aboutus',{
			resolve: {
				"check": function($location, $rootScope	){
					if( !$rootScope.loggedIn ){
						$location.path('/');
					}
				}
			},
			templateUrl: '/aboutus.html',
			controller: 'exchangifyController'
		})
		.when( '/contact',{
			resolve: {
				"check": function($location, $rootScope	){
					if( !$rootScope.loggedIn ){
						$location.path('/');
					}
				}
			},
			templateUrl: '/contact.html',
			controller: 'exchangifyController'
		})
		.otherwise( {
			redirectTo: '/'
		});

	});

	// app.controller('loginController', function($scope,$location,$routeScope,$http){

	// 	// $scope.aboutUs = function(){
	// 	// 	$rootScope.loggedIn = true;
	// 	// 	$location.path('/aboutus');
	// 	// };

	// 	// $scope.contact = function(){
	// 	// 	$rootScope.loggedIn = true;
	// 	// 	$location.path('/contact');
	// 	// };

	// 	// $scope.dashboard = function(){
	// 	// 	$rootScope.loggedIn = true;
	// 	// 	$location.path('/dashboard');
	// 	// };
	// });

	app.controller('exchangifyController', function($scope, $location, $rootScope,$http){

		// var init = function () {
  //           if ($routeParams.dashboard) {

		// 		$('#datetimepicker1').datetimepicker();
  //               //$scope.ticketSelected($routeParams.ticketId);
  //           }
  //       };

  //       // fire on controller loaded
  //       init();

		$scope.submit = function(){
			var uname = $scope.username;
			var pswd = $scope.password;
			if( uname == 'admin' && pswd =='admin'){
		        $rootScope.loggedIn = true;
		        $('#loginPageNavBar').hide();
		        $location.path('/dashboard');
		      // $window.location.href = 'dashboard.html';
			}
			else{
				alert('Wrong stuff');
			}
		};


		$scope.aboutUs = function(){
			$rootScope.loggedIn = true;
			$location.path('/aboutus');
		};

		$scope.contact = function(){
			$rootScope.loggedIn = true;
			$location.path('/contact');
		};

		$scope.dashboard = function(){
			$rootScope.loggedIn = true;
			$location.path('/dashboard');
		};	

	});

	app.controller('dashboardController', function($scope, $location, $rootScope,$http){
		
		$('.selectpicker').selectpicker({
		   dropupAuto: false,
		   showTick: true,
	       iconBase: 'glyphicon',
   			tickIcon: 'glyphicon-ok'
		});

		$('#datepicker1').datepicker({
			format: 'yyyy-mm-dd'
		});

	
		$rootScope.curModelSecond = 1;
		$rootScope.curModelFirst = 1;
		$rootScope.curSelectOne="USD";
		$rootScope.curSelectTwo="INR";
		$rootScope.toggleChange = false;

		var _oLatest = new Object();
		var _strUrl = "http://api.fixer.io/";
		
		function updateModelValue(otherval, r1, r2){
			var updatedValue = null;

			updatedValue = Math.round( parseFloat(otherval*(r1/r2)) * 100) /100;

			return updatedValue;
		};

		//Get latest data
		$http.get(_strUrl+"latest").
		    success(function(data, status, headers, config) {
    	        _oLatest = data;

				var firstCurSel = $rootScope.curSelectOne;
				var secondCurSel = $rootScope.curSelectTwo;
				if( _oLatest.rates != null){
					$rootScope.curModelSecond = updateModelValue($rootScope.curModelFirst, _oLatest.rates[secondCurSel], _oLatest.rates[firstCurSel]);
				}
				$scope.curModelSecond = $rootScope.curModelSecond;
				if(!$scope.$$phase) {
					$scope.$digest();	
				}	
		    }).
		    error(function(data, status, headers, config) {
		      // log error
		      console.log("Unable to fetch request.")
	    });

		$(function(){

			$scope.$watch('curModelFirst', function(newValue, oldValue, scope) {
				$rootScope.curModelFirst = newValue;

				var firstCurSel = $rootScope.curSelectOne;
				var secondCurSel = $rootScope.curSelectTwo;
				if( _oLatest.rates != null){
					$rootScope.curModelSecond = updateModelValue($rootScope.curModelFirst, _oLatest.rates[secondCurSel], _oLatest.rates[firstCurSel]);
				}
				$scope.curModelSecond = $rootScope.curModelSecond;
				if(!$scope.$$phase) {
					$scope.$digest();	
				}			
			});


			$scope.$watch('curModelSecond', function(newValue, oldValue, scope) {

				$rootScope.curModelSecond = newValue;

				var firstCurSel = $rootScope.curSelectOne;
				var secondCurSel = $rootScope.curSelectTwo;
				if( _oLatest.rates != null){
					$rootScope.curModelFirst = updateModelValue(newValue, _oLatest.rates[firstCurSel], _oLatest.rates[secondCurSel]);
				}
				$scope.curModelFirst = $rootScope.curModelFirst
				if(!$scope.$$phase) {
					$scope.$digest();	
				}	
			});

			$('select.selectpicker.curSelectOptionOne').on('change', function(){
				$rootScope.curSelectOne = this.value;

				var firstCurSel = $rootScope.curSelectOne;
				var secondCurSel = $rootScope.curSelectTwo;
				if( _oLatest.rates != null){
					$rootScope.curModelSecond = updateModelValue($rootScope.curModelFirst, _oLatest.rates[secondCurSel], _oLatest.rates[firstCurSel]);
				}
				$scope.curModelSecond = $rootScope.curModelSecond;
				if(!$scope.$$phase) {
					$scope.$digest();	
				}
			});

			$('select.selectpicker.curSelectOptionTwo').on('change', function(){
				$rootScope.curSelectTwo = this.value;

				var firstCurSel = $rootScope.curSelectOne;
				var secondCurSel = $rootScope.curSelectTwo;
				if( _oLatest.rates != null){
					$rootScope.curModelFirst = updateModelValue($rootScope.curModelSecond, _oLatest.rates[firstCurSel], _oLatest.rates[secondCurSel]);
				}
				$scope.curModelFirst = $rootScope.curModelFirst
				if(!$scope.$$phase) {
					$scope.$digest();	
				}
			});
		});
			
		$rootScope.histCurModelSecond = 0;
		$rootScope.histCurModelFirst = 0;
		$rootScope.histCurSelectOne="USD";
		$rootScope.histCurSelectTwo="INR";
		$rootScope.toggleChange = false;

		var _oHistoricalData= new Object();

		$scope.getHistoricalData = function(){
			var strDate = $('#datepicker1').find("input").val();

			//Get latest data
			$http.get(_strUrl+strDate).
			    success(function(data, status, headers, config) {
			      updateHistoricalData( data );
			    }).
			    error(function(data, status, headers, config) {
			      // log error
			      console.log("Unable to fetch request.")
		    });
	
		};

		function updateHistoricalData(data){
		    _oHistoricalData = data;
			$rootScope.histCurModelSecond = 1;
			$rootScope.histCurModelFirst = 1;
			var firstCurSel = $rootScope.histCurSelectOne;
			var secondCurSel = $rootScope.histCurSelectTwo;
			if( _oHistoricalData.rates != null){
				$rootScope.histCurModelSecond = updateModelValue($rootScope.histCurModelFirst, _oHistoricalData.rates[secondCurSel], _oHistoricalData.rates[firstCurSel]);
			}
			$scope.histCurModelSecond = $rootScope.histCurModelSecond;
			if(!$scope.$$phase) {
				$scope.$digest();	
			}	
		};

		$scope.$watch('histCurModelFirst', function(newValue, oldValue, scope) {
			$rootScope.histCurModelFirst = newValue;

			var firsthistCurSel = $rootScope.histCurSelectOne;
			var secondhistCurSel = $rootScope.histCurSelectTwo;
			if( _oHistoricalData.rates != null){
				$rootScope.histCurModelSecond = updateModelValue($rootScope.histCurModelFirst, _oHistoricalData.rates[secondhistCurSel], _oHistoricalData.rates[firsthistCurSel]);
			}
			$scope.histCurModelSecond = $rootScope.histCurModelSecond;
			if(!$scope.$$phase) {
				$scope.$digest();	
			}			
		});


		$scope.$watch('histCurModelSecond', function(newValue, oldValue, scope) {

			$rootScope.histCurModelSecond = newValue;

			var firsthistCurSel = $rootScope.histCurSelectOne;
			var secondhistCurSel = $rootScope.histCurSelectTwo;
			if( _oHistoricalData.rates != null){
				$rootScope.histCurModelFirst = updateModelValue(newValue, _oHistoricalData.rates[firsthistCurSel], _oHistoricalData.rates[secondhistCurSel]);
			}
			$scope.histCurModelFirst = $rootScope.histCurModelFirst
			if(!$scope.$$phase) {
				$scope.$digest();	
			}	
		});

		$('select.selectpicker.histCurSelectOptionOne').on('change', function(){
			$rootScope.histCurSelectOne = this.value;

			var firsthistCurSel = $rootScope.histCurSelectOne;
			var secondhistCurSel = $rootScope.histCurSelectTwo;
			if( _oHistoricalData.rates != null){
				$rootScope.histCurModelSecond = updateModelValue($rootScope.histCurModelFirst, _oHistoricalData.rates[secondhistCurSel], _oHistoricalData.rates[firsthistCurSel]);
			}
			$scope.histCurModelSecond = $rootScope.histCurModelSecond;
			if(!$scope.$$phase) {
				$scope.$digest();	
			}
		});

		$('select.selectpicker.histCurSelectOptionTwo').on('change', function(){
			$rootScope.histCurSelectTwo = this.value;

			var firsthistCurSel = $rootScope.histCurSelectOne;
			var secondhistCurSel = $rootScope.histCurSelectTwo;
			if( _oHistoricalData.rates != null){
				$rootScope.histCurModelFirst = updateModelValue($rootScope.histCurModelSecond, _oHistoricalData.rates[firsthistCurSel], _oHistoricalData.rates[secondhistCurSel]);
			}
			$scope.histCurModelFirst = $rootScope.histCurModelFirst
			if(!$scope.$$phase) {
				$scope.$digest();	
			}
		});

	});