(function () {

	angular.module('aecApp', [
		'ngAnimate', 'ui.router',
		'ct.ui.router.extras', 'mgcrea.ngStrap',
		'ngDisqus', 'hc.marked',
		'fox.scrollReveal'
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
				url: '/docs/:id',
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

		if ( typeof $stateParams.id == 'undefined' || $stateParams.id == '' ) {
			$stateParams.id = 'welcome'
		}

		$scope.id = $stateParams.id;

		var switchPage = function(id) {
			$scope.path = '/docs/' + $scope.pages[$scope.map[id]].path;

			$timeout(function(){
				$rootScope.loading = false;
			}, 500);
		};

		var mapPages = function() {
			var deferred = $q.defer(),
				promises = [];

			angular.forEach(list, function(page, key){
				var deferred = $q.defer();

				$scope.map[page.handle] = key;

				deferred.resolve();

				promises.push(deferred.promise);
			});

			$q.all(promises).then(function(item){
				deferred.resolve();
			});

			return deferred.promise;
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
				switchPage($scope.id);
			}
		};

		$http.get('docs/index.json')
			.then(function(index){
				list = index.data;

				mapPages()
					.then(function() {
						keepalive = $timeout(tick, 400);
					});
			});

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
	function DocAsideCtrl( $rootScope, $scope, $http, $timeout, $aside )
	{
		var list = [],
			keepalive,
			id = 0;

		$scope.pages = [];

		$scope.id = { id: $rootScope.docsid.value };

		$http.get('docs/index.json')
			.then(function(index){
				list = index.data;

				keepalive = $timeout(tick, 400);
			});

		$scope.aside = $aside(
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

		$rootScope.$on('backHome', function (event, data) {
			$scope.aside.hide();
		});
	}

	DocAsideCtrl.$inject = ['$rootScope', '$scope', '$http', '$timeout', '$aside'];
	angular.module('aecApp').controller('DocAsideCtrl', DocAsideCtrl);


})();
