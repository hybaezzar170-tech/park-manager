<?php

namespace Tests\Unit;

use Tests\TestCase;

class EnvironnementTestTest extends TestCase
{
    public function test_les_tests_utilisent_la_base_de_test(): void
    {
        $base = config('database.connections.mysql.database');

        $this->assertSame('alba_test', $base);
    }

    public function test_environnement_est_testing(): void
    {
        $this->assertSame('testing', app()->environment());
    }
}