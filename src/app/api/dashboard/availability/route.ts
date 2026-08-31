import { CreateAvailabilitySlotsSchemaTypes } from "@/features/interviews/dashboard/schemas/dashboard.schemas";
import {
   createAvailabilitySlots,
   deleteAvailabilitySlot,
   getAvailabilitySlots
} from "@/features/interviews/dashboard/services/dashboard.server.service";
import { apiErrorResponse, apiResponse } from "@/lib/api-response";
import { NextRequest } from "next/server";

export async function GET() {
   try {
      const slots = await getAvailabilitySlots();

      return apiResponse({
         statusCode: 200,
         data: slots
      });
   } catch (error: unknown) {
      return apiErrorResponse({ error });
   }
}

export async function POST(request: NextRequest) {
   try {
      const body = (await request.json()) as CreateAvailabilitySlotsSchemaTypes;
      const result = await createAvailabilitySlots(body);

      return apiResponse({
         statusCode: 201,
         data: result
      });
   } catch (error: unknown) {
      return apiErrorResponse({ error });
   }
}

export async function DELETE(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url);
      const id = searchParams.get("id");

      if (!id) {
         return apiResponse({
            statusCode: 400,
            message: "Slot ID is required"
         });
      }

      const result = await deleteAvailabilitySlot(id);

      return apiResponse({
         statusCode: 200,
         data: result
      });
   } catch (error: unknown) {
      return apiErrorResponse({ error });
   }
}
