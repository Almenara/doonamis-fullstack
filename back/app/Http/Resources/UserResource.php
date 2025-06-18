<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    { 
        if (is_null($this->resource)) {
            return [];
        }

        return [
            'id' => $this->id,
            'attributes' => [
                'email' =>      $this->email,
                'name' =>       $this->name,
                'last_name' =>  $this->last_name,
                'phone' =>      $this->phone,
                'address' =>    $this->address,
            ],
        ];

    }
}
