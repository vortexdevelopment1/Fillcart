import React, { useState } from 'react';
import { NotificationsSettings, NotificationChannel, NotificationTemplate } from '../../types/settings';
import { ToggleSwitch } from './ToggleSwitch';
import { TemplateEditorModal } from './TemplateEditorModal';
import { ReplaceSecretModal } from './ReplaceSecretModal';
import { useToast } from '../../context/ToastContext';
import { Send, Edit3, MessageSquare, Mail, Bell, Smartphone } from 'lucide-react';

interface NotificationsTabProps {
  data: NotificationsSettings;
  onChange: (updates: Partial<NotificationsSettings>) => void;
  readOnly?: boolean;
}

export const NotificationsTab: React.FC<NotificationsTabProps> = ({
  data,
  onChange,
  readOnly = false,
}) => {
  const { addToast } = useToast();
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);
  const [replacingSecretChannel, setReplacingSecretChannel] = useState<{
    id: keyof NotificationsSettings['channels'];
    name: string;
    provider: string;
  } | null>(null);

  const handleChannelToggle = (channelKey: keyof NotificationsSettings['channels']) => {
    onChange({
      channels: {
        ...data.channels,
        [channelKey]: {
          ...data.channels[channelKey],
          enabled: !data.channels[channelKey].enabled,
        },
      },
    });
  };

  const handleChannelFieldChange = (
    channelKey: keyof NotificationsSettings['channels'],
    field: keyof NotificationChannel,
    value: string
  ) => {
    onChange({
      channels: {
        ...data.channels,
        [channelKey]: {
          ...data.channels[channelKey],
          [field]: value,
        },
      },
    });
  };

  const handleSendTest = (channel: NotificationChannel) => {
    addToast(
      'success',
      `Test Notification Dispatched`,
      `Sample ping sent via ${channel.provider} (${channel.name}). Delivery check OK.`
    );
  };

  const handleSaveTemplate = (updatedTemplate: NotificationTemplate) => {
    onChange({
      templates: data.templates.map((t) => (t.id === updatedTemplate.id ? updatedTemplate : t)),
    });
    addToast('info', 'Template Updated', `Saved changes to "${updatedTemplate.title}" template.`);
  };

  const channelIcons = {
    sms: Smartphone,
    whatsapp: MessageSquare,
    email: Mail,
    push: Bell,
  };

  return (
    <div className="space-y-7">
      {/* ──────────────── GROUP 1: GATEWAY CHANNELS & PROVIDERS ──────────────── */}
      <section>
        <h3 className="text-[13px] font-semibold text-primary/80 uppercase tracking-wider mb-3">
          Notification Gateways & Integrations
        </h3>
        <div className="space-y-3.5">
          {(Object.keys(data.channels) as Array<keyof NotificationsSettings['channels']>).map((key) => {
            const channel = data.channels[key];
            const Icon = channelIcons[key] || Bell;

            return (
              <div
                key={channel.id}
                className="p-4 rounded-2xl border border-primary/15 bg-white shadow-xs space-y-3"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-ink">{channel.name}</span>
                        <span className="text-[10px] text-primary/60 bg-neutral px-2 py-0.5 rounded-full font-mono">
                          {channel.provider}
                        </span>
                      </div>
                      <p className="text-[11px] text-primary/60 mt-0.5">
                        Sender ID: <span className="font-mono font-medium text-ink/80">{channel.senderId}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end sm:self-auto">
                    <button
                      type="button"
                      disabled={readOnly || !channel.enabled}
                      onClick={() => handleSendTest(channel)}
                      className="h-8 px-3 rounded-lg border border-primary/20 bg-white hover:bg-neutral text-xs font-medium text-ink flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Send className="w-3 h-3 text-secondary" />
                      <span>Send test</span>
                    </button>
                    <ToggleSwitch
                      id={`channel-${channel.id}`}
                      checked={channel.enabled}
                      onChange={() => handleChannelToggle(key)}
                      disabled={readOnly}
                      aria-label={`Toggle ${channel.name}`}
                    />
                  </div>
                </div>

                {/* Configuration row: Sender ID & Masked API Key */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2.5 border-t border-primary/10">
                  <div>
                    <label htmlFor={`senderId-${key}`} className="text-[11px] font-medium text-primary/70 block mb-1">
                      Sender ID / Header / From Address
                    </label>
                    <input
                      id={`senderId-${key}`}
                      type="text"
                      disabled={readOnly || !channel.enabled}
                      value={channel.senderId}
                      onChange={(e) => handleChannelFieldChange(key, 'senderId', e.target.value)}
                      className="w-full h-8 px-2.5 rounded-lg border border-primary/20 text-xs font-mono text-ink bg-white focus:outline-none focus:ring-2 focus:ring-secondary disabled:bg-neutral"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-primary/70 block mb-1">
                      API Secret Key
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-8 px-2.5 rounded-lg border border-primary/15 bg-neutral/60 flex items-center text-xs font-mono text-ink/70">
                        {channel.apiKey}
                      </div>
                      <button
                        type="button"
                        disabled={readOnly || !channel.enabled}
                        onClick={() =>
                          setReplacingSecretChannel({
                            id: key,
                            name: channel.name,
                            provider: channel.provider,
                          })
                        }
                        className="h-8 px-2.5 rounded-lg bg-white border border-primary/20 hover:bg-neutral text-xs font-medium text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-secondary disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Replace
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ──────────────── GROUP 2: SYSTEM MESSAGE TEMPLATES ──────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-[13px] font-semibold text-primary/80 uppercase tracking-wider">
              System Notification Templates
            </h3>
            <p className="text-[11px] text-primary/60 mt-0.5">
              Automated message templates for order notifications, OTPs, and partner lifecycle triggers.
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {data.templates.map((tpl) => (
            <div
              key={tpl.id}
              className="p-3.5 rounded-xl border border-primary/15 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs hover:border-primary/30 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-ink">{tpl.title}</span>
                  <code className="text-[10px] bg-primary/5 text-primary px-1.5 py-0.5 rounded font-mono">
                    {tpl.event}
                  </code>
                </div>
                <p className="text-[11px] text-primary/60 mt-1 line-clamp-1 max-w-xl">
                  {tpl.body}
                </p>
              </div>

              <button
                type="button"
                disabled={readOnly}
                onClick={() => setEditingTemplate(tpl)}
                className="h-8 px-3 rounded-lg border border-primary/20 bg-white hover:bg-neutral text-xs font-medium text-ink flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary disabled:opacity-50 self-start sm:self-auto"
              >
                <Edit3 className="w-3.5 h-3.5 text-secondary" />
                <span>Edit</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Modals */}
      <TemplateEditorModal
        isOpen={!!editingTemplate}
        onClose={() => setEditingTemplate(null)}
        template={editingTemplate}
        onSave={handleSaveTemplate}
      />

      <ReplaceSecretModal
        isOpen={!!replacingSecretChannel}
        onClose={() => setReplacingSecretChannel(null)}
        title={replacingSecretChannel?.name || ''}
        provider={replacingSecretChannel?.provider || ''}
        onSave={(newSecret) => {
          if (replacingSecretChannel) {
            handleChannelFieldChange(replacingSecretChannel.id, 'apiKey', newSecret);
          }
        }}
      />
    </div>
  );
};
