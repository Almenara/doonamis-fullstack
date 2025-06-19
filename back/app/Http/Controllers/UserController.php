<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

use App\Traits\ApiResponses;
use App\Models\User;
use App\Http\Resources\UserResource;

class UserController extends Controller
{
    use ApiResponses;

    protected array $errors = [];

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::all();

        return $this->success(
            UserResource::collection($users),
            Response::HTTP_OK
        );
    }

    public function indexSoftDeleted()
    {
        $users = User::withTrashed()->get();

        return $this->success(
            UserResource::collection($users),
            Response::HTTP_OK
        );
    }

    public function importCSV(Request $request)
    {
        try {
            $request->validate([
                'file' => 'required|file|mimes:csv|max:2048',
            ]);
            $file = $request->file('file');
            $handle = fopen($file->getRealPath(), 'r');
            $data = [];
            while (($row = fgetcsv($handle, 0, ',')) !== false) {
                $data[] = $row;
            }
            fclose($handle);

            //borramos el archivo temporal
            if (file_exists($file->getRealPath())) {
                unlink($file->getRealPath());
            }

            $csvHandle = $this->handleCSVData($data);

            foreach ($csvHandle['users'] as $userData) {

                $this->createOrUpdate($userData);
            }

            return $this->success(
                ['message' => [
                    'success' => count($csvHandle['users']) . " usuarios importados correctamente.",
                    'errors' => count($csvHandle['errors']) . " errores encontrados.",
                    'details' => $csvHandle['errors'],
                ]],
                Response::HTTP_OK
            );
        } catch (\Exception $e) {
            $this->errors[] = [
                'row' => $data,
                'error' => $e->getMessage(),
            ];
            return $this->error(
                ['message' => ['Error al procesar el archivo CSV: ' . json_encode($this->errors)]],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    private function handleCSVData(array $data)
    {
        $errors = [];
        $users = [];

        foreach ($data as $row) {
            try {
                $rowUser = [
                    'name'      => $row[0] ?? null,
                    'last_name' => $row[1] ?? null,
                    'email'     => $row[2] ?? null,
                    'phone'     => $row[3] ?? null,
                    'address'   => $row[4] ?? null,
                ];
                //validamos el tipo de dato de cada columna
                $validator = Validator::make($rowUser, [
                    'name' => 'required|string|max:255',
                    'last_name' => 'required|string|max:255',
                    'email' => 'required|email|max:255',
                    'phone' => 'required|string|max:20',
                    'address' => 'required|string|max:255',
                ]);
                if ($validator->fails()) {
                    $errors[] = [
                        'user' => $rowUser,
                        'errors' => $validator->errors()->all(),
                    ];
                }
                else if (isset($row[2]) && $row[2] === auth()->user()->email) {
                    $errors[] = [
                        'user' => $rowUser,
                        'errors' => ['No se puede importar el usuario autenticado.'],
                    ];
                } 
                else{
                    $users[] = $rowUser;
                }
            } catch (\Exception $e) {
                $this->errors[] = [
                    'user' => $rowUser,
                    'errors' => ['Error procesando la fila: ' . $e->getMessage()],
                ];
                continue;
            }
        }
        return ['users' => $users, 'errors' => $errors];
    }

    /**
     * Show the form for creating a new resource.
     */
    public function createOrUpdate($data)
    {
        
        $user = User::withTrashed()->updateOrCreate(
            ['email' => $data['email']],
            $data
        );
        if ($user->trashed()) {
            $user->restore(); 
        }
    
    }

    public function softDelete(string $id)
    {
        // si el usuario es el usuario autenticado, no se puede eliminar
        if (auth()->user()->id == $id) {
            return $this->error(
                ['message' => ['No se puede eliminar el usuario autenticado.']],
                Response::HTTP_FORBIDDEN
            );
        }

        $user = User::findOrFail($id);
        $user->delete();

        return $this->success(
            ['message' => ['Usuario eliminado correctamente.']],
            Response::HTTP_OK
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
