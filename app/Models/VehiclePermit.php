<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\VehiclePermit
 *
 * @property int $id
 * @property int $employee_id
 * @property string $vehicle_type
 * @property string $license_plate
 * @property \Illuminate\Support\Carbon $usage_start
 * @property \Illuminate\Support\Carbon $usage_end
 * @property string|null $purpose
 * @property string $status
 * @property string|null $hr_comments
 * @property \Illuminate\Support\Carbon|null $approved_at
 * @property int|null $approved_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Employee $employee
 * @property-read \App\Models\User|null $approver
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\WhatsappNotification> $notifications
 * @property-read int|null $notifications_count
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|VehiclePermit newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|VehiclePermit newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|VehiclePermit query()
 * @method static \Illuminate\Database\Eloquent\Builder|VehiclePermit whereApprovedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehiclePermit whereApprovedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehiclePermit whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehiclePermit whereEmployeeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehiclePermit whereHrComments($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehiclePermit whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehiclePermit whereLicensePlate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehiclePermit wherePurpose($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehiclePermit whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehiclePermit whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehiclePermit whereUsageEnd($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehiclePermit whereUsageStart($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehiclePermit whereVehicleType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehiclePermit pending()
 * @method static \Illuminate\Database\Eloquent\Builder|VehiclePermit approved()
 * @method static \Illuminate\Database\Eloquent\Builder|VehiclePermit rejected()
 * @method static \Database\Factories\VehiclePermitFactory factory($count = null, $state = [])
 * @method static VehiclePermit create(array $attributes = [])
 * @method static VehiclePermit firstOrCreate(array $attributes = [], array $values = [])
 * 
 * @mixin \Eloquent
 */
class VehiclePermit extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'employee_id',
        'vehicle_type',
        'license_plate',
        'usage_start',
        'usage_end',
        'purpose',
        'status',
        'hr_comments',
        'approved_at',
        'approved_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'usage_start' => 'datetime',
        'usage_end' => 'datetime',
        'approved_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the employee that owns the permit.
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Get the user who approved the permit.
     */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Get the WhatsApp notifications for the permit.
     */
    public function notifications(): HasMany
    {
        return $this->hasMany(WhatsappNotification::class, 'permit_id');
    }

    /**
     * Scope a query to only include pending permits.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope a query to only include approved permits.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope a query to only include rejected permits.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }
}