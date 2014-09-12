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
	function AppCfg( $urlRouterProvider, $stateProvider, $locationProvider, $disqusProvider, $popoverProvider )
	{
		$urlRouterProvider
			.otherwise('/');

		$urlRouterProvider.deferIntercept();

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

		$locationProvider.hashPrefix('!');

		angular.extend($popoverProvider.defaults, {
			animation: 'am-fade-and-slide-bottom',
			type: 'info',
			delay: { show: 1000, hide: 10 },
			trigger: 'hover',
			placement: 'bottom-left'
		});
	}

	AppCfg.$inject = ['$urlRouterProvider', '$stateProvider', '$locationProvider', '$disqusProvider', '$popoverProvider'];
	angular.module('aecApp').config(AppCfg);


	/**
	 * @name AppRun
	 *
	 * @desc Data to prepare when we run the application
	 */
	function AppRun( $rootScope, $state, $location )
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


		$rootScope.$on(
			'$locationChangeSuccess',
			function(e)
			{
				if ( $state.current.name === "" ) {
					if ( $location.path() === "" ) {
						$location.path("/");
					}
				}
			});
	}

	AppRun.$inject = ['$rootScope', '$state', '$location'];
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
	function DocCtrl( $scope, $rootScope, $q, $timeout, $http, $stateParams, $aside, $location )
	{
		var list = [],
			keepalive,
			id = 0,
			seen = [];

		$scope.fullpath = 'start/welcome';

		$scope.pages = [];

		$scope.map = {};

		if ( typeof $stateParams.path == 'undefined' || $stateParams.path == '' ) {
			$stateParams.path = 'start';
			$stateParams.doc = 'welcome';
		}

		$scope.path = $stateParams.path;
		$scope.doc = $stateParams.doc;

		$scope.switchPage = function(path) {
			if ( $scope.fullpath == path ) {
				$rootScope.loading = false;

				return;
			}

			$rootScope.loading = true;

			$scope.fullpath = path;

			$scope.path = path.split('/')[0];
			$scope.doc = path.split('/')[1];

			if( $location.path() != "/docs/"+path ) {
				$location.path("/docs/"+path);
			}

			if ( angular.element.inArray($scope.fullpath, seen) == -1 ) {
				seen.push($scope.fullpath);
			}

			$timeout(function(){
				$rootScope.loading = false;
			}, 4000);
		};

		$rootScope.$on(
			'$locationChangeSuccess',
			function(e)
			{
				var lpath = $location.path();

				if ( lpath.substr(1,4) === "docs" ) {
					if ( lpath.substr(6) !== $scope.fullpath ) {
						$scope.switchPage(lpath.substr(6));
					}
				}
			});

		var tick = function () {
			$scope.pages.push(list[id]);

			id++;

			if ( list.length > id ) {
				keepalive = $timeout(tick, 40);
			} else {
				$scope.switchPage($stateParams.path+'/'+$stateParams.doc);
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

	DocCtrl.$inject = ['$scope', '$rootScope', '$q', '$timeout', '$http', '$stateParams', '$aside', '$location'];
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
