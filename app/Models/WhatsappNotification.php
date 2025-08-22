<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\WhatsappNotification
 *
 * @property int $id
 * @property int $permit_id
 * @property string $recipient_phone
 * @property string $type
 * @property string $message
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $sent_at
 * @property string|null $error_message
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\VehiclePermit $permit
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|WhatsappNotification newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|WhatsappNotification newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|WhatsappNotification query()
 * @method static \Illuminate\Database\Eloquent\Builder|WhatsappNotification whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WhatsappNotification whereErrorMessage($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WhatsappNotification whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WhatsappNotification whereMessage($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WhatsappNotification wherePermitId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WhatsappNotification whereRecipientPhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WhatsappNotification whereSentAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WhatsappNotification whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WhatsappNotification whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WhatsappNotification whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WhatsappNotification pending()
 * @method static \Illuminate\Database\Eloquent\Builder|WhatsappNotification sent()
 * @method static \Database\Factories\WhatsappNotificationFactory factory($count = null, $state = [])
 * @method static WhatsappNotification create(array $attributes = [])
 * @method static WhatsappNotification firstOrCreate(array $attributes = [], array $values = [])
 * 
 * @mixin \Eloquent
 */
class WhatsappNotification extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'permit_id',
        'recipient_phone',
        'type',
        'message',
        'status',
        'sent_at',
        'error_message',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'sent_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the permit that owns the notification.
     */
    public function permit(): BelongsTo
    {
        return $this->belongsTo(VehiclePermit::class);
    }

    /**
     * Scope a query to only include pending notifications.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope a query to only include sent notifications.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeSent($query)
    {
        return $query->where('status', 'sent');
    }
}