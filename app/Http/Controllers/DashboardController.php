<?php

namespace App\Http\Controllers;

use App\Models\Fundo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Show the dashboard view.
     *
     * @return \Illuminate\View\View
     */
    public function index()
    {
        $fundos = Fundo::withTrashed()->get();
        return Inertia::render('Dashboard/Index', [
            'fundos' => $fundos,
        ]);
    }
}
