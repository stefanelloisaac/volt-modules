export const useFormTemplate = () => `import { ReactNode, useState } from "react";
import { useForm, FieldValues, Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { FormDescription } from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmationDialog } from "@/components/custom/ConfirmationDialog";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

export type FormAction = "create" | "read" | "update";

export interface FormFieldConfig<T extends FieldValues> {
  name: Path<T>;
  label: string;
  icon?: ReactNode;
  type:
    | "text"
    | "number"
    | "textarea"
    | "select"
    | "multiselect"
    | "checkbox"
    | "switch";
  placeholder?: string;
  options?: { value: string; label: string }[];
  rows?: number;
  className?: string;
  disabled?: boolean;
  transform?: (value: any) => any;
  validation?: (value: any) => boolean;
  description?: string;
}

export interface FormConfig<T extends FieldValues> {
  title: {
    create: string;
    read: string;
    update: string;
  };
  description: {
    create: string;
    read: string;
    update: string;
  };
  schema: z.ZodSchema<T>;
  fields: FormFieldConfig<T>[];
  gridCols?: number;
  onSubmit: (data: T, action: FormAction) => Promise<void>;
  isPending?: boolean;
}

export interface FormProps<T extends FieldValues> {
  action: FormAction;
  selectedItem?: Partial<T>;
  closeForm: () => void;
  config: FormConfig<T>;
  // Modal props
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  asModal?: boolean;
}

export function useFormHook<T extends FieldValues>(props: FormProps<T>) {
  const {
    action,
    selectedItem,
    closeForm,
    config,
    open,
    onOpenChange,
    asModal = true,
  } = props;
  const {
    title,
    description,
    schema,
    fields,
    gridCols = 2,
    onSubmit,
    isPending = false,
  } = config;

  const isReadonly = action === "read";
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: selectedItem as any,
  });

  const handleSubmit = async () => {
    await form.handleSubmit(async (data) => {
      try {
        await onSubmit(data, action);
        form.reset();
        closeForm();
      } catch (error) {
        console.error("Error saving:", error);
        if (error instanceof Error) {
          form.setError("root", {
            type: "submit",
            message: \`Erro ao salvar: \${error.message}\`,
          });
        }
      }
    })();
  };

  const handleConfirmClick = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      setIsConfirmOpen(true);
    }
  };

  const renderField = (field: FormFieldConfig<T>) => {
    const isFieldDisabled = isReadonly || field.disabled;

    // Special handling for switch fields
    if (field.type === "switch") {
      return (
        <FormField
          key={field.name}
          control={form.control}
          name={field.name}
          render={({ field: formField }) => (
            <FormItem className={field.className}>
              <FormControl>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="flex items-center gap-2">
                      {field.icon}
                      {field.label}
                    </FormLabel>
                    {field.description && (
                      <FormDescription className="text-xs">
                        {field.description}
                      </FormDescription>
                    )}
                  </div>
                  <Switch
                    checked={formField.value || false}
                    onCheckedChange={formField.onChange}
                    disabled={isFieldDisabled}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      );
    }

    return (
      <FormField
        key={field.name}
        control={form.control}
        name={field.name}
        render={({ field: formField }) => (
          <FormItem className={field.className}>
            <FormLabel className={field.icon ? "flex items-center gap-2" : ""}>
              {field.icon}
              {field.label}
            </FormLabel>
            <FormControl>
              {(() => {
                switch (field.type) {
                  case "text":
                    return (
                      <Input
                        placeholder={field.placeholder}
                        value={formField.value || ""}
                        disabled={isFieldDisabled}
                        onChange={(e) => {
                          const value = field.transform
                            ? field.transform(e.target.value)
                            : e.target.value;
                          formField.onChange(value);
                        }}
                      />
                    );
                  case "number":
                    return (
                      <Input
                        placeholder={field.placeholder}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        autoComplete="off"
                        value={
                          formField.value === 0
                            ? ""
                            : formField.value?.toString() ?? ""
                        }
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || /^\\d+$/.test(value)) {
                            const transformedValue = field.transform
                              ? field.transform(value)
                              : value === ""
                              ? 0
                              : parseInt(value, 10);
                            formField.onChange(transformedValue);
                          }
                        }}
                        disabled={isFieldDisabled}
                      />
                    );
                  case "textarea":
                    return (
                      <Textarea
                        placeholder={field.placeholder}
                        {...formField}
                        disabled={isFieldDisabled}
                        rows={field.rows || 3}
                        value={formField.value || ""}
                      />
                    );
                  case "select":
                    return (
                      <Select
                        onValueChange={formField.onChange}
                        value={formField.value?.toString()}
                        disabled={isFieldDisabled}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={field.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    );
                  case "multiselect":
                    const selectedValues: (string | number)[] = Array.isArray(
                      formField.value
                    )
                      ? (formField.value as (string | number)[])
                      : [];
                    return (
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">
                          {selectedValues.length > 0
                            ? \`\${selectedValues.length} selecionado(s)\`
                            : field.placeholder || "Selecione itens"}
                        </div>
                        <div className="max-h-32 overflow-y-auto border rounded-md p-2 space-y-1">
                          {field.options?.map((option) => {
                            const isSelected = selectedValues.includes(
                              option.value
                            );
                            return (
                              <div
                                key={option.value}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  disabled={isFieldDisabled}
                                  checked={isSelected}
                                  onCheckedChange={(checked) => {
                                    const newValues = checked
                                      ? [...selectedValues, option.value]
                                      : selectedValues.filter(
                                          (v) => v !== option.value
                                        );
                                    formField.onChange(newValues);
                                  }}
                                />
                                <label
                                  className="text-sm cursor-pointer"
                                  onClick={() => {
                                    if (!isFieldDisabled) {
                                      const isSelected =
                                        selectedValues.includes(option.value);
                                      const newValues = isSelected
                                        ? selectedValues.filter(
                                            (v) => v !== option.value
                                          )
                                        : [...selectedValues, option.value];
                                      formField.onChange(newValues);
                                    }
                                  }}
                                >
                                  {option.label}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  case "checkbox":
                    return (
                      <div className="flex items-center space-x-2">
                        <span className="text-xs">{field.description}</span>
                        <Checkbox
                          disabled={isFieldDisabled}
                          checked={formField.value || false}
                          onCheckedChange={(checked: boolean) => {
                            formField.onChange(checked);
                          }}
                        />
                      </div>
                    );
                  default:
                    return null;
                }
              })()}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  const formContent = (
    <Card
      className={cn("w-full", {
        "max-w-[500px]": gridCols === 1,
        "max-w-[700px]": gridCols === 2,
        "max-w-[900px]": gridCols === 3,
        "max-w-[1100px]": gridCols === 4,
      })}
    >
      <CardHeader>
        <CardTitle>{title[action]}</CardTitle>
        <CardDescription>{description[action]}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => {})} className="space-y-6">
            <div
              className={\`grid gap-6 \${
                gridCols > 1 ? \`grid-cols-\${gridCols}\` : ""
              }\`}
            >
              {fields.map(renderField)}
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={closeForm}
                disabled={isPending}
                className="w-28"
              >
                {isReadonly ? "Voltar" : "Cancelar"}
              </Button>
              {!isReadonly && (
                <ConfirmationDialog
                  open={isConfirmOpen}
                  onOpenChange={setIsConfirmOpen}
                  onConfirm={handleSubmit}
                  isPending={isPending}
                  variant={action}
                  trigger={
                    <Button
                      type="button"
                      className="w-28"
                      onClick={handleConfirmClick}
                      disabled={isPending}
                    >
                      {isPending && (
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      )}
                      {isPending
                        ? "Salvando"
                        : action === "create"
                        ? "Criar"
                        : "Salvar"}
                    </Button>
                  }
                />
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );

  const formComponent =
    asModal && open !== undefined && onOpenChange ? (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTitle />
        <DialogDescription className="sr-only">
          {description[action]}
        </DialogDescription>
        <DialogContent
          className={cn(
            "p-0",
            "gap-0",
            "max-h-[90vh] border-0",
            gridCols === 1
              ? "w-[500px] max-w-[500px]"
              : gridCols === 2
              ? "w-[700px] max-w-[700px]"
              : gridCols === 3
              ? "w-[900px] max-w-[900px]"
              : gridCols === 4
              ? "w-[1100px] max-w-[1100px]"
              : "w-[700px] max-w-[700px]"
          )}
        >
          {formContent}
        </DialogContent>
      </Dialog>
    ) : (
      formContent
    );

  return {
    form,
    formComponent,
    handleSubmit,
    isConfirmOpen,
    setIsConfirmOpen,
  };
}`;

export const usePageTemplate = () => `import { ReactNode, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { usePermissions } from "@/hooks/use-permissions";
import { Toolbar } from "@/components/layout/toolbar";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useTabPreference } from "@/hooks/use-user-preferences";

export interface PageAction {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  permissionCheck?: (permissions: ReturnType<typeof usePermissions>) => boolean;
}

export interface EmptyAction {
  empty: true;
}

export const EMPTY_ACTION: EmptyAction = { empty: true };

export function usePage<
  const T extends readonly {
    value: string;
    label: string;
    permissionCheck?: (
      permissions: ReturnType<typeof usePermissions>
    ) => boolean;
  }[]
>(config: {
  title: string;
  defaultTab?: T[number]["value"];
  tabs: T;
  actions: { [K in T[number]["value"]]: PageAction | EmptyAction };
  content: { [K in T[number]["value"]]: ReactNode };
  customContent?: { [K in T[number]["value"]]?: ReactNode };
  persistTabs?: boolean;
}) {
  const {
    title,
    defaultTab,
    tabs,
    actions,
    content,
    customContent,
    persistTabs = true,
  } = config;

  const pageName = title.toLowerCase().replace(/\\s+/g, "-");

  const { activeTab: savedTab, setActiveTab: saveTab } =
    useTabPreference(pageName);

  const initialTab = (persistTabs && savedTab) || defaultTab || tabs[0]?.value;
  const [currentTab, setCurrentTab] = useState(initialTab);

  const permissions = usePermissions();

  useEffect(() => {
    if (persistTabs && savedTab && savedTab !== currentTab) {
      setCurrentTab(savedTab);
    }
  }, [savedTab, currentTab, persistTabs]);

  const handleTabChange = (tabValue: string) => {
    setCurrentTab(tabValue);
    if (persistTabs) {
      saveTab(tabValue);
    }
  };

  const processedTabs = tabs.map((tab) => ({
    value: tab.value,
    label: tab.label,
    disabled: tab.permissionCheck ? !tab.permissionCheck(permissions) : false,
  }));

  const currentAction = actions[currentTab as T[number]["value"]];
  const currentCustomContent =
    customContent?.[currentTab as T[number]["value"]];

  const actionButton = currentCustomContent ? null : currentAction &&
    "empty" in currentAction ? null : currentAction &&
    (currentAction.permissionCheck
      ? currentAction.permissionCheck(permissions)
      : true) ? (
    <Button
      onClick={currentAction.onClick}
      disabled={currentAction.disabled}
      className={currentAction.className || "flex items-center w-[120px]"}
    >
      {currentAction.icon}
      {currentAction.label}
    </Button>
  ) : null;

  const toolbar = (
    <Toolbar
      title={title}
      tabs={processedTabs}
      actionButtons={actionButton}
      currentTab={currentTab}
    >
      {currentCustomContent}
    </Toolbar>
  );

  const page = (
    <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
      {toolbar}
      {Object.entries(content).map(([tabValue, tabContent]) => (
        <TabsContent key={tabValue} value={tabValue} className="p-0 m-0 mt-2">
          {tabContent as ReactNode}
        </TabsContent>
      ))}
    </Tabs>
  );

  return {
    page,
    currentTab,
    setCurrentTab: handleTabChange,
  };
}`;

export const useUserPreferencesTemplate = () => `import { useState, useCallback } from "react";
import { userPreferencesService } from "@/services/user-preferences";

// hook para preferencias de usuario
export function useUserPreferences() {
  const [preferences, setPreferences] = useState(() =>
    userPreferencesService.getAll()
  );

  const forceUpdate = useCallback(() => {
    setPreferences(userPreferencesService.getAll());
  }, []);

  const getActiveTab = useCallback((pageName: string) => {
    return userPreferencesService.getActiveTab(pageName);
  }, []);

  const setActiveTab = useCallback(
    (pageName: string, tabValue: string) => {
      userPreferencesService.setActiveTab(pageName, tabValue);
      forceUpdate();
    },
    [forceUpdate]
  );

  const getPreference = useCallback(<T>(key: string): T | undefined => {
    return userPreferencesService.get<T>(key);
  }, []);

  const setPreference = useCallback(
    (key: string, value: any) => {
      userPreferencesService.set(key, value);
      forceUpdate();
    },
    [forceUpdate]
  );

  const clearPreferences = useCallback(() => {
    userPreferencesService.clear();
    forceUpdate();
  }, [forceUpdate]);

  return {
    // tabs
    getActiveTab,
    setActiveTab,

    // preferencias genericas
    getPreference,
    setPreference,
    clearPreferences,

    preferences,
  };
}

// hook para tabs
export function useTabPreference(pageName: string) {
  const { getActiveTab, setActiveTab } = useUserPreferences();

  const activeTab = getActiveTab(pageName);

  const setTab = useCallback(
    (tabValue: string) => {
      setActiveTab(pageName, tabValue);
    },
    [pageName, setActiveTab]
  );

  return {
    activeTab,
    setActiveTab: setTab,
  };
}

// hook para sidebar
export function useSidebarPreferences() {
  const [, forceUpdate] = useState(0);

  const triggerUpdate = useCallback(() => {
    forceUpdate((prev) => prev + 1);
  }, []);

  const getSectionState = useCallback((sectionKey: string): boolean => {
    return userPreferencesService.getSidebarSectionState(sectionKey);
  }, []);

  const setSectionState = useCallback(
    (sectionKey: string, isOpen: boolean) => {
      userPreferencesService.setSidebarSectionState(sectionKey, isOpen);
      triggerUpdate();
    },
    [triggerUpdate]
  );

  const searchTerm = userPreferencesService.getSidebarSearchTerm();

  const setSearchTerm = useCallback(
    (term: string) => {
      userPreferencesService.setSidebarSearchTerm(term);
      triggerUpdate();
    },
    [triggerUpdate]
  );

  return {
    getSectionState,
    setSectionState,
    searchTerm,
    setSearchTerm,
  };
}`;