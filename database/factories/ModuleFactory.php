<?php

namespace Database\Factories;

use App\Models\Module;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Module>
 */
class ModuleFactory extends Factory
{
    protected $model = Module::class;

    protected static int $planSequence = 0;

    public function definition(): array
    {
        self::$planSequence = self::$planSequence < 50 ? self::$planSequence + 1 : 1;

        return [
            'name' => fake()->sentence(),
            'plan_id' => self::$planSequence,
        ];
    }
}
