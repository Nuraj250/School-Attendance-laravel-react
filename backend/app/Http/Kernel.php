protected $middlewareGroups = [
    'web' => [
        \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        // ... default web middleware
    ],
    'api' => [
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ],
    'role' => \App\Http\Middleware\RoleMiddleware::class,
];

