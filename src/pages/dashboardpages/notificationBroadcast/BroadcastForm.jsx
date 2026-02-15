import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { isSendDisabled } from "@/lib/broadcastNotificationUtils";
import AudienceSelector from "./AudienceSelector";
import BroadcastPreview from "./BroadcastPreview";

const BroadcastForm = ({
  form,
  errors,
  onChange,
  onToggleUserType,
  onSelectAllUserTypes,
  onSubmit,
  onReset,
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">Compose Broadcast</CardTitle>
    </CardHeader>
    <CardContent className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700" htmlFor="broadcast-title">
          Title
        </label>
        <Input
          id="broadcast-title"
          maxLength={200}
          value={form.title}
          onChange={(event) => onChange("title", event.target.value)}
          placeholder="Notification title"
        />
        <p className="text-xs text-gray-500">{form.title.length}/200</p>
        {errors.title ? <p className="text-sm text-red-600">{errors.title}</p> : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700" htmlFor="broadcast-body">
          Message
        </label>
        <Textarea
          id="broadcast-body"
          maxLength={1000}
          rows={5}
          value={form.body}
          onChange={(event) => onChange("body", event.target.value)}
          placeholder="Write notification message..."
        />
        <p className="text-xs text-gray-500">{form.body.length}/1000</p>
        {errors.body ? <p className="text-sm text-red-600">{errors.body}</p> : null}
      </div>

      <AudienceSelector
        selected={form.userTypes}
        error={errors.userTypes}
        onToggle={onToggleUserType}
        onSelectAll={onSelectAllUserTypes}
      />

      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-800">Options</h4>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={form.includeInactive}
            onChange={(event) => onChange("includeInactive", event.target.checked)}
          />
          Include inactive users
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={form.sendPush}
            onChange={(event) => onChange("sendPush", event.target.checked)}
          />
          Send push notification
        </label>
      </div>

      <BroadcastPreview
        title={form.title}
        body={form.body}
        userTypes={form.userTypes}
        includeInactive={form.includeInactive}
        sendPush={form.sendPush}
      />

      <div className="flex flex-wrap gap-2 pt-2">
        <Button
          type="button"
          className="bg-[#1C5941] hover:bg-[#1C5941]"
          onClick={onSubmit}
          disabled={isSendDisabled(form.submitting)}
        >
          {form.submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Notification"
          )}
        </Button>
        <Button type="button" variant="outline" disabled={form.submitting} onClick={onReset}>
          Reset
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default BroadcastForm;
