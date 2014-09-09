(function () {

	angular.module('aecApp', [
		'ngAnimate', 'ui.router',
		'ct.ui.router.extras', 'mgcrea.ngStrap',
		'ngDisqus', 'hc.marked'
	]);


	/**
	 * @name AppCfg
	 *
	 * @desc Set up the Application
	 */
	function AppCfg( $urlRouterProvider, $stateProvider, $locationProvider, $disqusProvider )
	{
		$urlRouterProvider
			.otherwise('/');

		$stateProvider
			.state('home', {
				url: '/',
				views: {
					"main": {
						templateUrl: '/partials/home.html'
					},
					"background": {
						templateUrl: '/partials/carina.html'
					}
				}
			})

			.state('docs', {
				url: '/docs/:path/:doc',
				views: {
					"main": {
						templateUrl: '/partials/doc.html'
					},
					"background": {
						templateUrl: '/partials/empty.html'
					}
				}
			})

		;

		$disqusProvider.setShortname('valanx');

		$locationProvider.hashPrefix('!')
	}

	AppCfg.$inject = ['$urlRouterProvider', '$stateProvider', '$locationProvider', '$disqusProvider'];
	angular.module('aecApp').config(AppCfg);


	/**
	 * @name AppRun
	 *
	 * @desc Data to prepare when we run the application
	 */
	function AppRun( $rootScope, $state )
	{
		$rootScope.$state = $state;

		$rootScope.$on(
			'$stateChangeStart',
			function(event, toState, toParams, fromState, fromParams) {
				$rootScope.loading = true;
			});

		$rootScope.$on(
			'$stateChangeSuccess',
			function(event, toState, toParams, fromState, fromParams) {
				$rootScope.loading = false;
			});
	}

	AppRun.$inject = ['$rootScope', '$state'];
	angular.module('aecApp').run(AppRun);


	function scrollOnClickDirective($location) {
		return {
			restrict: 'A',
			link: function(scope, $elm, attrs) {
				var settings = angular.extend({
					href: angular.element(),
					offset: 0,
					duration: 1600,
					easing: 'easeInOutQuint'
				}, attrs);

				settings.href = settings.href.replace('#','');

				$elm.on('click', function(e) {
					//e.preventDefault();

					var scroll;

					if (settings.href) {
						scroll = $('#'+settings.href).offset().top + Number(settings.offset);

						$location.hash(settings.href);
					} else {
						scroll = $elm.offset().top + Number(settings.offset);
					}

					$('html, body').animate(
						{scrollTop: scroll},
						settings.duration,
						settings.easing
					);
				});
			}
		}
	}

	scrollOnClickDirective.$inject = ['$location'];
	angular.module('aecApp').directive('scrollOnClick', scrollOnClickDirective);

	/**
	 * @name HomeCtrl
	 *
	 * @desc Controls Behavior on a doc screen
	 */
	function HomeCtrl( $scope, $rootScope, $state )
	{
		$rootScope.loading = false;

		$rootScope.$broadcast('backHome');
	}

	HomeCtrl.$inject = ['$scope', '$rootScope', '$state'];
	angular.module('aecApp').controller('HomeCtrl', HomeCtrl);


	/**
	 * @name ProcessorsCtrl
	 *
	 * @desc Controls Behavior on the processor section
	 */
	function ProcessorsCtrl( $scope, $http )
	{
		$scope.processors = [];

		$http.get('processors.json')
			.then(function(processors){
				$scope.processors = processors.data;
			});
	}

	ProcessorsCtrl.$inject = ['$scope', '$http'];
	angular.module('aecApp').controller('ProcessorsCtrl', ProcessorsCtrl);


	/**
	 * @name IntegrationsCtrl
	 *
	 * @desc Controls Behavior on the mi section
	 */
	function IntegrationsCtrl( $scope, $http )
	{
		$scope.types = {};
		$scope.searchText = '';
		$scope.type = 'communication';
		$scope.mis = [];

		$http.get('mitypes.json')
			.then(function(types){
				$scope.types = types.data;

				$http.get('mis.json')
					.then(function(mis){
						$scope.mis = mis.data;
					});
			});

		$scope.toggleType = function(type) {
			if ( $scope.type == type ) {
				$scope.type = '';
			} else {
				$scope.type = type;
			}
		};

		$scope.eraseSearch = function(type) {
			$scope.searchText = '';
		};
	}

	IntegrationsCtrl.$inject = ['$scope', '$http'];
	angular.module('aecApp').controller('IntegrationsCtrl', IntegrationsCtrl);


	/**
	 * @name DocCtrl
	 *
	 * @desc Controls Behavior on a doc screen
	 */
	function DocCtrl( $scope, $rootScope, $q, $timeout, $http, $stateParams, $aside )
	{
		var list = [],
			keepalive,
			id = 0;

		$scope.path = '';

		$scope.pages = [];

		$scope.map = {};

		if ( typeof $stateParams.path == 'undefined' || $stateParams.path == '' ) {
			$stateParams.path = 'start';
			$stateParams.doc = 'welcome';
		}

		var switchPage = function(path) {
			$rootScope.loading = true;

			$scope.path = path;

			$timeout(function(){
				$rootScope.loading = false;
			}, 500);
		};

		$scope.$watch('id', function(newVal, oldVal) {
			if (newVal !== oldVal) switchPage(newVal);
		});

		var tick = function () {
			$scope.pages.push(list[id]);

			id++;

			if ( list.length > id ) {
				keepalive = $timeout(tick, 40);
			} else {
				switchPage($stateParams.path+'/'+$stateParams.doc);
			}
		};

		var aside = $aside(
			{
				scope: $scope,
				template: 'partials/doc.aside.html',
				placement: 'left',
				animation: 'am-fade-and-slide-left',
				backdrop: false,
				keyboard: false,
				container: '#background'
			}
		);

		$http.get('docs/index.json')
			.then(function(index){
				list = index.data;

				keepalive = $timeout(tick, 400);
			});

		$rootScope.$on('backHome', function (event, data) {
			aside.hide();
		});
	}

	DocCtrl.$inject = ['$scope', '$rootScope', '$q', '$timeout', '$http', '$stateParams', '$aside'];
	angular.module('aecApp').controller('DocCtrl', DocCtrl);


	/**
	 * @name DocAsideCtrl
	 *
	 * @desc Controls Behavior on the side naviation for docs
	 */
	function DocAsideCtrl( $scope )
	{
		var list = [],
			keepalive,
			id = 0;
	}

	DocAsideCtrl.$inject = ['$scope'];
	angular.module('aecApp').controller('DocAsideCtrl', DocAsideCtrl);


})();
