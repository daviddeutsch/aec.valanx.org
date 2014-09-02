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
	function AppCfg( $urlRouterProvider, $stateProvider, $disqusProvider )
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
				},
				onEnter: function(){
					angular.element('.aside').remove();
				}
			})

			.state('docs', {
				url: '/docs/:id',
				views: {
					"main": {
						templateUrl: '/partials/doc.html'
					},
					"background": {
						templateUrl: '/partials/empty.html',
						controller: 'DocAsideCtrl'
					}
				},
				deepStateRedirect: true,
				sticky: true
			})

		;

		$disqusProvider.setShortname('valanx');
	}

	AppCfg.$inject = ['$urlRouterProvider', '$stateProvider', '$disqusProvider'];
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
					duration: 3200,
					easing: 'easeOutExpo'
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
	}

	HomeCtrl.$inject = ['$scope', '$rootScope', '$state'];
	angular.module('aecApp').controller('HomeCtrl', HomeCtrl);


	/**
	 * @name DocCtrl
	 *
	 * @desc Controls Behavior on a doc screen
	 */
	function DocCtrl( $scope, $rootScope, $stateParams, $http )
	{
		if ( $stateParams.id == '' ) {
			$stateParams.id = 'welcome';
		}

		$scope.id = $stateParams.id;

		$scope.path = '';

		var switchPage = function(id) {
			angular.forEach($scope.pages, function(page){
				if ( page.handle == id ) {
					$scope.path = '/docs/' + page.path;
				}
			});
		};

		$scope.$watch('id', function(newVal, oldVal) {
			if (newVal !== oldVal) switchPage(newVal);
		});

		$http.get('docs/index.json')
			.then(function(index){
				$scope.pages = index.data;

				switchPage($stateParams.id);
			});

		$rootScope.loading = false;
	}

	DocCtrl.$inject = ['$scope', '$rootScope', '$stateParams', '$http'];
	angular.module('aecApp').controller('DocCtrl', DocCtrl);


	/**
	 * @name DocAsideCtrl
	 *
	 * @desc Controls Behavior on the side naviation for docs
	 */
	function DocAsideCtrl( $scope, $http, $timeout, $state, $aside )
	{
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

		var list = [],
			keepalive,
			id = 0;

		$scope.$state = $state;

		$scope.pages = [];

		var tick = function () {
			$scope.pages.push(list[id]);

			id++;

			if ( list.length > id ) {
				keepalive = $timeout(tick, 40);
			}
		};

		$http.get('docs/index.json')
			.then(function(index){
				list = index.data;

				keepalive = $timeout(tick, 400);
			});

	}

	DocAsideCtrl.$inject = ['$scope', '$http', '$timeout', '$state', '$aside'];
	angular.module('aecApp').controller('DocAsideCtrl', DocAsideCtrl);


})();
