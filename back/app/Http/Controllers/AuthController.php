<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Response;

use App\Traits\ApiResponses;
use App\Models\User;
use App\Http\Resources\UserResource;

class AuthController extends Controller
{
    use ApiResponses;

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'message' => ['Credenciales incorrectas.'],
            ]);
        }
        
        return $this->success(
            [
                'message' => ['Inicio de sesión exitoso.'],
                'user'  => new UserResource($user),
                'token' => $user->createToken(request('email'))->plainTextToken
            ],
            Response::HTTP_OK
        );
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return $this->success(
            [],
            Response::HTTP_OK
        );
    }
}
